
import type { Expression, Style, ScriptType, NumberOfSpeakers, AiProvider, TopicSuggestionItem } from './types';

interface LabeledOption<T> {
  value: T;
  label: string;
}

export const APP_BRAND = {
  name: 'Chú Que Tài Chính',
  channelTagline: 'Video tài chính cá nhân thực chiến cho người Việt',
  defaultLanguage: 'Vietnamese',
} as const;

export const AI_PROVIDER_OPTIONS: LabeledOption<AiProvider>[] = [
    { value: 'kyma', label: 'Kyma API' },
    { value: 'openai', label: 'OpenAI Tương Thích' },
];

export const DEFAULT_KYMA_MODELS: LabeledOption<string>[] = [
    { value: 'gemini-2.5-flash', label: 'Kyma Default (gemini-2.5-flash)' },
];

export const OPENAI_MODELS: LabeledOption<string>[] = [
    { value: 'gpt-4o-mini', label: 'Custom: gpt-4o-mini' },
];

export const SCRIPT_TYPE_OPTIONS: LabeledOption<ScriptType>[] = [
    { value: 'Video', label: 'Video YouTube' },
    { value: 'Podcast', label: 'Podcast' },
];

export const NUMBER_OF_SPEAKERS_OPTIONS: LabeledOption<NumberOfSpeakers>[] = [
  { value: 'Auto', label: 'Tự động' },
  { value: '2', label: '2 người' },
  { value: '3', label: '3 người' },
  { value: '4', label: '4 người' },
  { value: '5', label: '5 người' },
];

export const EXPRESSION_OPTIONS: LabeledOption<Expression>[] = [
  { value: 'Empathetic', label: 'Đồng cảm' },
  { value: 'Conversational', label: 'Thân mật' },
  { value: 'Authoritative', label: 'Chuyên gia' },
  { value: 'Analytical', label: 'Phân tích sắc bén' },
];

export const STYLE_OPTIONS: LabeledOption<Style>[] = [
  { value: 'Narrative', label: 'Kể chuyện' },
  { value: 'Analytical', label: 'Phân tích số liệu' },
  { value: 'Storytelling', label: 'Kể chuyện có nhân vật' },
  { value: 'Educational', label: 'Dạy học theo bước' },
];

export const LANGUAGE_OPTIONS: { value: string, label: string }[] = [
    { value: 'Vietnamese', label: 'Tiếng Việt' },
    { value: 'English', label: 'Tiếng Anh' },
];

export const FINANCE_IDEAS: TopicSuggestionItem[] = [
    {
        title: "Sự thật về Lãi Kép: Kỳ quan thứ 8 của Thế giới",
        outline: "Giải thích cơ chế hoạt động của lãi kép, cách nó giúp một khoản đầu tư nhỏ trở thành tài sản khổng lồ theo thời gian. Đưa ra ví dụ thực tế và các công thức đơn giản."
    },
    {
        title: "Tại sao bạn luôn hết tiền vào cuối tháng? (Bẫy thu nhập)",
        outline: "Phân tích tâm lý 'lối sống lạm phát' (Lifestyle creep), khi thu nhập tăng thì chi tiêu cũng tăng theo. Hướng dẫn cách lập ngân sách 50/30/20 để quản lý chi tiêu."
    },
    {
        title: "Đầu tư ETF cho người mới bắt đầu: Chậm mà Chắc",
        outline: "Giới thiệu về Quỹ hoán đổi danh mục (ETF), sự khác biệt giữa ETF và cổ phiếu lẻ. Tại sao Warren Buffett khuyên người bình thường nên đầu tư vào quỹ chỉ số S&P 500."
    },
    {
        title: "Nợ Tốt vs Nợ Xấu: Đừng để thẻ tín dụng làm chủ bạn",
        outline: "Sự khác biệt cốt lõi giữa nợ mang lại giá trị (nợ tốt để kinh doanh, mua tài sản) và nợ tiêu dùng (nợ xấu). Chiến lược 'quả cầu tuyết' để thanh toán dứt điểm nợ thẻ tín dụng."
    },
    {
        title: "Quỹ Dự Phòng Khẩn Cấp: Lá chắn an toàn trong thời kỳ suy thoái",
        outline: "Tầm quan trọng của việc có 3-6 tháng chi phí sinh hoạt. Hướng dẫn cách từng bước xây dựng quỹ dự phòng và nơi để cất giữ nó sao cho an toàn, dễ rút nhưng vẫn sinh lời nhẹ."
    }
];
