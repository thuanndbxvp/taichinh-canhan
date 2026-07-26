import { supabase } from '../lib/supabase';
import type { ScriptRepository, ListResult } from './Repository';
import { RepositoryError } from './Repository';
import type { ScriptDocument, ScriptId } from './ScriptDocument';
import { createScriptDocument } from './ScriptDocument';

export class SupabaseScriptRepository implements ScriptRepository {
  private async getDefaultProjectId(): Promise<string> {
    const { data: userSession } = await supabase.auth.getSession();
    const userId = userSession.session?.user?.id;
    if (!userId) {
      throw RepositoryError.fromKind('UNKNOWN', 'User not logged in');
    }

    // Check if user has a project
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (projectsError) {
      throw RepositoryError.fromKind('IO', 'Lỗi lấy danh sách dự án: ' + projectsError.message, projectsError);
    }

    if (projects && projects.length > 0) {
      return projects[0].id;
    }

    // Create default project
    const { data: newProject, error: createError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: 'Default Project',
        niche: 'finance'
      })
      .select('id')
      .single();

    if (createError) {
      throw RepositoryError.fromKind('IO', 'Lỗi tạo dự án mặc định: ' + createError.message, createError);
    }

    return newProject.id;
  }

  async list(): Promise<ScriptDocument[]> {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw RepositoryError.fromKind('IO', 'Lỗi tải danh sách kịch bản: ' + error.message, error);
    }

    return (data || []).map(row => {
      // Reconstruct ScriptDocument
      const doc = createScriptDocument({
        title: row.title,
        outlineContent: row.outline || '',
        script: row.content || '',
        brief: row.brief || undefined,
      });
      // override id and dates
      return {
        ...doc,
        id: row.id,
        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),
      };
    });
  }

  async get(id: ScriptId): Promise<ScriptDocument | null> {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw RepositoryError.fromKind('IO', 'Lỗi lấy kịch bản: ' + error.message, error);
    }

    if (!data) return null;

    const doc = createScriptDocument({
      title: data.title,
      outlineContent: data.outline || '',
      script: data.content || '',
      brief: data.brief || undefined,
    });

    return {
      ...doc,
      id: data.id,
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
    };
  }

  async save(doc: ScriptDocument): Promise<ScriptDocument> {
    const projectId = await this.getDefaultProjectId();

    // Check if exists
    const { data: existing } = await supabase
      .from('scripts')
      .select('id')
      .eq('id', doc.id)
      .single();

    if (existing) {
      // Update
      const { error } = await supabase
        .from('scripts')
        .update({
          title: doc.title,
          brief: doc.brief || {}, 
          outline: doc.outlineContent,
          content: doc.script,
          updated_at: new Date().toISOString()
        })
        .eq('id', doc.id);

      if (error) throw RepositoryError.fromKind('IO', 'Lỗi cập nhật: ' + error.message, error);
      
      return {
        ...doc,
        updatedAt: Date.now()
      };
    } else {
      // Insert
      // Create a valid UUID since ScriptDocument might generate arbitrary strings
      // We'll let Supabase generate UUID, so we omit 'id'
      const { data, error } = await supabase
        .from('scripts')
        .insert({
          project_id: projectId,
          title: doc.title,
          brief: doc.brief || {}, 
          outline: doc.outlineContent,
          content: doc.script,
        })
        .select('id, created_at, updated_at')
        .single();

      if (error) throw RepositoryError.fromKind('IO', 'Lỗi lưu mới: ' + error.message, error);

      return {
        ...doc,
        id: data.id,
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime(),
      };
    }
  }

  async delete(id: ScriptId): Promise<void> {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id);

    if (error) throw RepositoryError.fromKind('IO', 'Lỗi xóa kịch bản: ' + error.message, error);
  }

  async migrateFromLegacy(_legacyItems: any[]): Promise<number> {
    // Migration feature handled outside for now
    return 0;
  }
}
