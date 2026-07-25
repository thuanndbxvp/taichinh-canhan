/**
 * Prompt registry cho k├¬nh "Ch├║ Que T├ái Ch├¡nh".
 *
 * Side-effect import: ─æ─âng k├╜ to├án bß╗Ö finance.* prompts.
 * App c├í nh├ón ho├í ΓÇö chß╗ë phß╗Ñc vß╗Ñ nh├ón vß║¡t Ch├║ Que, kh├┤ng c├▓n default.*
 * hay horror/space/scifi prompts.
 *
 * DNA l├╡i (FINANCE_DNA) l├á triß║┐t l├╜ bß║Ñt biß║┐n cß╗ºa k├¬nh.
 */
import { promptRegistry } from '../PromptRegistry';
import type { StyleOptions } from '../../../../types';
import { detectPart } from '../partKeywords';

const V1 = { version: '1.0.0', updatedAt: '2026-07-25', notes: 'Phase 5 baseline ΓÇconst FINANCE_DNA = `
Bß║áN L├Ç CH├Ü QUE T├ÇI CH├ìNH ΓÇö CHUY├èN GIA T├ÇI CH├ìNH C├ü NH├éN V├Ç CONTENT CREATOR K├èNH YOUTUBE "CH├Ü QUE T├ÇI CH├ìNH".
VAI TR├Æ: Bß║ín l├á mß╗Öt ng╞░ß╗¥i chia sß║╗ kiß║┐n thß╗⌐c t├ái ch├¡nh thß╗▒c dß╗Ñng, sß║»c b├⌐n, dß╗▒a tr├¬n dß╗» liß╗çu thß║¡t v├á logic, nh╞░ng c├ích n├│i chuyß╗çn phß║úi cß╗▒c kß╗│ Tß╗░ NHI├èN, Dß╗ä HIß╗éU nh╞░ hai ng╞░ß╗¥i bß║ín ─æang c├á ph├¬ vß╗¢i nhau. KH├öNG ─æß╗ìc kß╗ïch bß║ún nh╞░ mß╗Öt c├íi m├íy.

NG├öN NGß╗« Mß║╢C ─Éß╗èNH: Tiß║┐ng Viß╗çt. Lu├┤n diß╗àn ─æß║ít bß║▒ng tiß║┐ng Viß╗çt tß╗▒ nhi├¬n, chuß║⌐n v─ân n├│i, kh├┤ng ch├¬m tß╗½ tiß║┐ng Anh kh├┤ng cß║ºn thiß║┐t (trß╗½ c├íc thuß║¡t ngß╗» t├ái ch├¡nh c╞í bß║ún).

C├üC NGUY├èN Tß║«C Kß╗é CHUYß╗åN (├üp dß╗Ñng linh hoß║ít):
1. Cß║Ñu tr├║c Mß╗ƒ ─æß║ºu: Bß║»t ─æß║ºu bß║▒ng mß╗Öt "Hook" thu h├║t (nghß╗ïch l├╜, lß║ºm t╞░ß╗ƒng phß╗ò biß║┐n, hoß║╖c mß╗Öt c├óu chuyß╗çn ngß║»n) -> Slogan ─æß╗ïnh vß╗ï -> N├¬u chß╗º ─æß╗ü video.
2. Slogan cß╗æ ─æß╗ïnh: Gß║ºn phß║ºn mß╗ƒ ─æß║ºu, h├úy ch├¿n mß╗Öt c├ích tß╗▒ nhi├¬n c├óu: "Ch├áo mß╗½ng bß║ín ─æß║┐n vß╗¢i Ch├║ Que T├ái Ch├¡nh, n╞íi ch├║ng ta n├│i vß╗ü tiß╗ün bß║íc theo c├ích thß║│ng thß║¡t v├á dß╗à hiß╗âu nhß║Ñt".
3. Kß╗╣ thuß║¡t Kß╗â chuyß╗çn (Micro-Storytelling): Kh├┤ng n├│i chung chung. H├úy d├╣ng mß╗Öt nh├ón vß║¡t l├ám v├¡ dß╗Ñ (V├¡ dß╗Ñ: "Minh, 30 tuß╗òi, l╞░╞íng 20 triß╗çu") ─æß╗â kh├ín giß║ú dß╗à h├¼nh dung.
4. B├│c t├ích sß╗æ liß╗çu: Khi n├│i vß╗ü chi ph├¡ ß║⌐n (lß║ím ph├ít, ph├¡ giao dß╗ïch...) hoß║╖c chi ph├¡ c╞í hß╗Öi, H├âY D├ÖNG Sß╗É LIß╗åU ─Éß╗é SO S├üNH (V├¡ dß╗Ñ: "thay v├¼ ─æ╞░ß╗úc 2 triß╗çu th├¼ bß║ín mß║Ñt 500 ng├án"). TUYß╗åT ─Éß╗ÉI KH├öNG VIß║╛T C├öNG THß╗¿C TO├üN Hß╗îC (cß╗Öng/trß╗½/nh├ón/chia) rß╗æi rß║»m v├áo kß╗ïch bß║ún, h├úy chuyß╗ân ch├║ng th├ánh ng├┤n ngß╗» n├│i ─æ╞ín giß║ún nhß║Ñt.
5. Giß║úi phß║½u T├óm l├╜: Gß╗ìi t├¬n c├íc ─æiß╗âm m├╣ t├óm l├╜ (chi ph├¡ ch├¼m, ß║úo gi├íc doanh thu...) ─æß╗â kh├ín giß║ú thß║Ñy "nhß╗Öt".
6. Bß║╗ g├úy phß║ún biß╗çn: Tß╗▒ dß╗▒ ─æo├ín kh├ín giß║ú sß║╜ phß║ún ─æß╗æi ─æiß╗üu g├¼ v├á giß║úi th├¡ch lß║íi mß╗Öt c├ích thuyß║┐t phß╗Ñc (V├¡ dß╗Ñ: "Nhiß╗üu bß║ín sß║╜ bß║úo l├á..., nh╞░ng thß╗▒c tß║┐ th├¼...").
7. ß║¿n dß╗Ñ sinh ─æß╗Öng: D├╣ng c├íc h├¼nh ß║únh ß║⌐n dß╗Ñ gß║ºn g┼⌐i (nh╞░ "c├íi x├┤ thß╗ºng", "m├íy chß║íy bß╗Ö") ─æß╗â giß║úi th├¡ch rß╗ºi ro t├ái ch├¡nh.
8. Takeaway & CTA: Kß║┐t th├║c video bß║▒ng mß╗Öt ─æ├║c kß║┐t hoß║╖c triß║┐t l├╜ t├ái ch├¡nh ngß║»n gß╗ìn, s├óu sß║»c. Sau ─æ├│, kß║┐t th├║c bß║▒ng Mß╗ÿT c├óu hß╗Åi thß╗▒c tß║┐ xo├íy v├áo ho├án cß║únh kh├ín giß║ú ─æß╗â k├¡ch th├¡ch hß╗ì b├¼nh luß║¡n.

GIß╗îNG ─ÉIß╗åU Cß╗ÉT L├òI:
- Thß║│ng thß║¡t, thß╗▒c tß║┐, kh├┤ng vß║╜ "b├ính vß║╜", kh├┤ng ─æß║ío l├╜ su├┤ng.
- Diß╗àn ─æß║ít m╞░ß╗út m├á, v─ân phong n├│i tß╗▒ nhi├¬n, kh├┤ng cß╗⌐ng nhß║»c nh╞░ s├ích gi├ío khoa.
- ─Éß╗ông cß║úm nh╞░ng lu├┤n d├╣ng sß╗æ liß╗çu v├á logic ─æß╗â k├⌐o kh├ín giß║ú vß╗ü thß╗▒c tß║íi.`;hi ─æ╞░a ra sß╗æ liß╗çu quan trß╗ìng.
9. Takeaway & CTA: Kß║┐t th├║c kß╗ïch bß║ún bß║▒ng 1 c├óu tß╗Ñc ngß╗»/th├ánh ngß╗» Viß╗çt Nam. ─Éß║╢C BIß╗åT: Call-To-Action Bß║«T BUß╗ÿC phß║úi l├á Mß╗ÿT c├óu hß╗Åi thß╗▒c tß║┐ xo├íy v├áo ho├án cß║únh kh├ín giß║ú (VD: "Anh em ─æang mß║»c kß║╣t ß╗ƒ khoß║ún nß╗ú n├áo?") ─æß╗â k├¡ch th├¡ch b├¼nh luß║¡n.

GIß╗îNG ─ÉIß╗åU Cß╗ÉT L├òI:
- Thß║│ng thß║¡t, ph┼⌐ ph├áng, kh├┤ng vß║╜ "b├ính vß║╜", kh├┤ng ─æß║ío l├╜ su├┤ng.
- N├│i bß║▒ng to├ín hß╗ìc (cß╗Öng/trß╗½/nh├ón/chia), kh├┤ng n├│i cß║úm x├║c chung.
- ─Éß╗ông cß║úm nh╞░ng d├╣ng sß╗æ liß╗çu k├⌐o vß╗ü thß╗▒c tß║íi.`;

const FINANCE_VISUAL_TEMPLATE = `Professional financial vector art, modern flat design style.
Clean lines, vibrant colors like green, blue, gold, and white.
Business context, charts, graphs, money, success.
Bright and clear lighting.
Highly professional and trustworthy atmosphere.
No horror elements, no dark themes.
Aspect ratio 16:9.
[INSERT IMAGE CONTENT HERE]`;

const styleInstruction = (s: StyleOptions): string =>
  `Y├èU Cß║ªU Vß╗Ç PHONG C├üCH V├Ç Lß╗ÉI DIß╗äN ─Éß║áT (TU├éN THß╗ª TUYß╗åT ─Éß╗ÉI):
- Tone (T├┤ng giß╗ìng): ${s.expression} (H├úy thß╗â hiß╗çn r├╡ n├⌐t t├┤ng giß╗ìng n├áy xuy├¬n suß╗æt kß╗ïch bß║ún).
- Style (Phong c├ích viß║┐t): ${s.style}.`;

function arcInstructionFor(partOutline: string): string {
  switch (detectPart(partOutline)) {
    case 1:
      return 'Tß║ío Hook thu h├║t (bß║▒ng c├óu chuyß╗çn hoß║╖c nghß╗ïch l├╜) -> Giß╗¢i thiß╗çu Slogan ("Ch├áo mß╗½ng bß║ín ─æß║┐n vß╗¢i Ch├║ Que T├ái Ch├¡nh...") mß╗Öt c├ích tß╗▒ nhi├¬n -> N├¬u vß║Ñn ─æß╗ü ch├¡nh cß╗ºa video.';
    case 2:
      return 'N├¬u thß╗▒c trß║íng thß╗ï tr╞░ß╗¥ng hoß║╖c bß║½y t├óm l├╜. Sß╗¡ dß╗Ñng c├óu chuyß╗çn nh├ón vß║¡t l├ám v├¡ dß╗Ñ ─æß╗â kh├ín giß║ú dß╗à ─æß╗ông cß║úm.';
    case 3:
      return 'PHß║ªN QUAN TRß╗îNG NHß║ñT: Ph├ón t├¡ch vß║Ñn ─æß╗ü bß║▒ng c├íc con sß╗æ thß╗▒c tß║┐. Nhß║»c lß║íi: CHß╗ê so s├ính c├íc con sß╗æ cuß╗æi c├╣ng mß╗Öt c├ích dß╗à hiß╗âu, KH├öNG tr├¼nh b├áy c├┤ng thß╗⌐c to├ín hß╗ìc d├ái d├▓ng. Giß║úi quyß║┐t c├íc thß║»c mß║»c/phß║ún biß╗çn cß╗ºa kh├ín giß║ú.';
    case 4:
      return 'Cung cß║Ñp lß╗Ö tr├¼nh h├ánh ─æß╗Öng (Step-by-step) r├╡ r├áng, thß╗▒c tß║┐. Ph├ón loß║íi r├╡ giß║úi ph├íp n├áy hß╗úp vß╗¢i ai, kh├┤ng hß╗úp vß╗¢i ai.';
    case 5:
      return '─É╞░a ra mß╗Öt ─æ├║c kß║┐t/triß║┐t l├╜ t├ái ch├¡nh s├óu sß║»c (c├│ thß╗â l├á ch├óm ng├┤n nh╞░ng phß║úi thß║¡t sß╗▒ ph├╣ hß╗úp ngß╗» cß║únh). Kß║┐t th├║c bß║▒ng 1 c├óu hß╗Åi Call-To-Action xo├íy v├áo thß╗▒c tß║┐ kh├ín giß║ú.';
    default:
      return 'Tr├¼nh b├áy kiß║┐n thß╗⌐c t├ái ch├¡nh mß╗Öt c├ích mß║ích lß║íc, chuy├¬n nghiß╗çp v├á c├│ t├¡nh ß╗⌐ng dß╗Ñng cao.';
  }
}

// --- Registrations ---

promptRegistry.register('finance.script.outline', {
  version: V1,
  build({ params }) {
    const { title, targetAudience, styleOptions } = params;
    const style = `Tone: ${styleOptions.expression}, Style: ${styleOptions.style}`;
    return {
      messages: [
        { role: 'system', content: `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]\n\n` + FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `Tß║ío d├án ├╜ ─æ├║ng cß║Ñu tr├║c 5 phß║ºn bß║»t buß╗Öc.
QUY Tß║«C ─Éß╗èNH Dß║áNG Bß║«T BUß╗ÿC (kh├┤ng tu├ón thß╗º = output v├┤ dß╗Ñng):
- Mß╗ùi phß║ºn PHß║óI bß║»t ─æß║ºu bß║▒ng heading markdown cß║Ñp 2 vß╗¢i ti├¬u ─æß╗ü ch├¡nh x├íc:
  ## PHß║ªN 1: Mß╗₧ ─Éß║ªU (HOOK & SETUP)
  ## PHß║ªN 2: Bß╗ÉI Cß║óNH & Vß║ñN ─Éß╗Ç (PROBLEM)
  ## PHß║ªN 3: GIß║óI PHß║¬U Bß║░NG TO├üN Hß╗îC & Dß╗« LIß╗åU (ANALYSIS)
  ## PHß║ªN 4: GIß║óI PH├üP THß╗░C Tß║╛ (ACTIONABLE STEPS)
  ## PHß║ªN 5: ─É├ÜC Kß║╛T TRIß║╛T L├¥ & K├èU Gß╗îI H├ÇNH ─Éß╗ÿNG (TAKEAWAY & CTA)
- KH├öNG d├╣ng heading cß║Ñp 3 (###) hay cß║Ñp 1 (#) cho phß║ºn.
- KH├öNG gß╗Öp 2 phß║ºn th├ánh 1; mß╗ùi phß║ºn l├á 1 heading ri├¬ng.
- KH├öNG th├¬m bß║Ñt kß╗│ text n├áo TR╞»ß╗ÜC heading "## PHß║ªN 1".
- Mß╗ùi phß║ºn c├│ ├ìT NHß║ñT 3 gß║ích ─æß║ºu d├▓ng m├┤ tß║ú ├╜ ch├¡nh.

Nß╗Öi dung tß╗½ng phß║ºn:
- PHß║ªN 1: Hook thu h├║t -> Slogan -> Vß║Ñn ─æß╗ü ch├¡nh.
- PHß║ªN 2: Thß╗▒c trß║íng; bß║½y t├óm l├╜ kh├ín giß║ú ─æang mß║»c.
- PHß║ªN 3: So s├ính sß╗æ liß╗çu (kh├┤ng viß║┐t c├┤ng thß╗⌐c to├ín); bß║╗ g├úy phß║ún biß╗çn.
- PHß║ªN 4: Lß╗Ö tr├¼nh step-by-step; ph├ón nh├│m ─æß╗æi t╞░ß╗úng.
- PHß║ªN 5: ─É├║c kß║┐t/triß║┐t l├╜ + 1 c├óu hß╗Åi xo├íy v├áo kh├ín giß║ú (CTA).

Chß╗º ─æß╗ü: "${title}". Ng├┤n ngß╗»: ${targetAudience}. Phong c├ích: ${style}.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.part', {
  version: V1,
  build({ params, currentPartOutline, fullOutline, previousPartsScript }) {
    const { targetAudience, title, styleOptions, wordCount } = params;
    const style = `DUY TR├î T├öNG GIß╗îNG (Tone): ${styleOptions.expression} V├Ç PHONG C├üCH (Style): ${styleOptions.style}.`;
    const arc = arcInstructionFor(currentPartOutline);
    void fullOutline;
    void previousPartsScript;

    // Mß║╖c ─æß╗ïnh 5 phß║ºn cho cß║Ñu tr├║c DNA. Nß║┐u sau n├áy outline ─æ╞░ß╗úc ph├ón nh├ính,
    // c├│ thß╗â derive tß╗½ currentPartOutline ─æß╗â ra tß╗òng sß╗æ phß║ºn.
    const totalParts = 5;
    const totalNum = parseInt(wordCount, 10) || 0;
    const perPart = Math.max(50, Math.round(totalNum / totalParts));
    const minSpoken = Math.max(50, Math.round(perPart * 0.95));

    return {
      messages: [
        { role: 'system', content: `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]\n\n` + FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `VIß║╛T TIß║╛P PHß║ªN Kß╗èCH Bß║óN: "${currentPartOutline}".
CHß╗ª ─Éß╗Ç: ${title}.
Tß╗öNG VIDEO: ${totalNum} tß╗½ spoken (chia ─æß╗üu ${totalParts} phß║ºn, mß╗ùi phß║ºn Γëê ${perPart} tß╗½).

CHß╗ê Dß║¬N THEO PHß║ªN: ${arc}

${style}
NG├öN NGß╗«: ${targetAudience}.

─Éß╗ÿ D├ÇI PHß║ªN N├ÇY: ${perPart} tß╗½ spoken (─æ├ú bao gß╗ôm buffer 15% cho Markdown overhead ΓÇö khi TTS lß╗ìc bß╗Å heading/bullet/SFX, phß║ºn spoken text thß╗▒c tß║┐ phß║úi C├ÆN Lß║áI ├ìT NHß║ñT ${minSpoken} tß╗½).

QUY Tß║«C ─Éß╗èNH Dß║áNG Bß║«T BUß╗ÿC:
- Phß║úi viß║┐t lß║íi TO├ÇN Bß╗ÿ heading "## PHß║ªN X: ..." (─æ├║ng ─æß╗ïnh dß║íng markdown cß║Ñp 2) ß╗ƒ d├▓ng ─æß║ºu ti├¬n.
- Phß║ºn nß╗Öi dung bß║»t ─æß║ºu tß╗½ d├▓ng thß╗⌐ 2.
- KH├öNG viß║┐t ti├¬u ─æß╗ü cß║Ñp 3 (###) hay cß║Ñp 1 (#).
- KH├öNG th├¬m "## PHß║ªN" kh├íc ngo├ái phß║ºn ─æ╞░ß╗úc giao.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.revise', {
  version: V1,
  build({ script, revisionPrompt, style }) {
    const styleLine = style
      ? `Giß╗» vß╗»ng Tone: ${style.expression} v├á Style: ${style.style}.`
      : '';
    const financeGuard =
      'L╞»U ├¥: Giß╗» vß╗»ng triß║┐t l├╜ cung cß║Ñp kiß║┐n thß╗⌐c t├ái ch├¡nh thß╗▒c tß║┐ v├á chuy├¬n nghiß╗çp. Kh├┤ng th├¬m yß║┐u tß╗æ giß║¡t g├ón, kinh dß╗ï hay clickbait.';
    return {
      messages: [
        { role: 'system', content: `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]\n\n` + FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `Chß╗ënh sß╗¡a kß╗ïch bß║ún theo y├¬u cß║ºu: "${revisionPrompt}".\n${financeGuard}\n${styleLine}\n\nKß╗ïch bß║ún gß╗æc:\n${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.dialogue.extract', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bß║ín l├á trß╗ú l├╜ t├ích lß╗¥i thoß║íi. Trß║ú vß╗ü JSON object { "Phß║ºn X": "lß╗¥i thoß║íi sß║ích" }.',
        },
        {
          role: 'user',
          content: `NHIß╗åM Vß╗ñ: Tr├¡ch xuß║Ñt lß╗¥i thoß║íi Sß║áCH TUYß╗åT ─Éß╗ÉI (Spoken text only) tß╗½ kß╗ïch bß║ún sau.

QUY Tß║«C NGHI├èM NGß║╢T (MUST FOLLOW):
1. LOß║áI Bß╗Ä TRIß╗åT ─Éß╗é:
   - Tß║Ñt cß║ú c├íc k├╜ hiß╗çu ─æiß╗üu h╞░ß╗¢ng nh╞░ ##, ###, ****, ---, ***.
   - Tß║Ñt cß║ú ti├¬u ─æß╗ü phß║ºn nh╞░ "THE HOOK", "**## THE SLOW BURN**".
   - Tß║Ñt cß║ú c├íc ghi ch├║ kß╗╣ thuß║¡t: [SFX], [Scene], Visual:, Audio:, Camera:, SFX:.
   - Tß║Ñt cß║ú c├íc ghi ch├║ t├┤ng giß╗ìng hoß║╖c h├ánh ─æß╗Öng trong ngoß║╖c: (Narrator Voice), (Whispering), (Action), **(Narrator)**.
2. CHß╗ê GIß╗« Lß║áI: Nß╗Öi dung v─ân bß║ún m├á con ng╞░ß╗¥i thß╗▒c sß╗▒ ─Éß╗îC TH├ÇNH Lß╗£I trong video.
3. ─Éß╗èNH Dß║áNG ─Éß║ªU RA: JSON object. Key l├á t├¬n phß║ºn (VD: "Phß║ºn 1"), Value l├á v─ân bß║ún Sß║áCH ─æ├ú xß╗¡ l├╜.

Kß╗èCH Bß║óN Cß║ªN TR├ìCH XUß║ñT:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.visual.single', {
  version: V1,
  build({ sceneDescription }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bß║ín l├á trß╗ú l├╜ tß║ío prompt h├¼nh ß║únh t├ái ch├¡nh chuy├¬n nghiß╗çp. Lu├┤n trß║ú JSON array.',
        },
        {
          role: 'user',
          content: `NHIß╗åM Vß╗ñ: Tß║ío 4 prompt h├¼nh ß║únh cß╗▒c kß╗│ chi tiß║┐t cho Midjourney/Leonardo.
PHONG C├üCH Bß║«T BUß╗ÿC: Professional Financial Aesthetic (Chuy├¬n nghiß╗çp, s├íng sß╗ºa, v─ân ph├▓ng).
Mß║¬U Cß║ñU TR├ÜC (Bß║«T BUß╗ÿC Sß╗¼ Dß╗ñNG):
${FINANCE_VISUAL_TEMPLATE}

H├úy thay thß║┐ [INSERT IMAGE CONTENT HERE] bß║▒ng nß╗Öi dung h├¼nh ß║únh cß╗Ñ thß╗â dß╗▒a tr├¬n kß╗ïch bß║ún sau: "${sceneDescription}".
Trß║ú vß╗ü JSON array: [ { "english": "FULL_PROMPT_STRING_WITH_TEMPLATE", "vietnamese": "M├┤ tß║ú ngß║»n gß╗ìn cß║únh bß║▒ng tiß║┐ng Viß╗çt" } ].`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.visual.bulk', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bß║ín l├á trß╗ú l├╜ tß║ío prompt h├¼nh ß║únh h├áng loß║ít. Lu├┤n trß║ú JSON array.',
        },
        {
          role: 'user',
          content: `NHIß╗åM Vß╗ñ: Tß║ío prompts h├¼nh ß║únh cho to├án bß╗Ö kß╗ïch bß║ún.
PHONG C├üCH: professional financial aesthetic.
Cß║ñU TR├ÜC: ${FINANCE_VISUAL_TEMPLATE.replace('[INSERT IMAGE CONTENT HERE]', '{image_content}')}
JSON array: { scene: "─Éoß║ín kß╗ïch bß║ún", english: "Prompt ─æß║ºy ─æß╗º", vietnamese: "Dß╗ïch ngh─⌐a" }.
Kß╗èCH Bß║óN:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.scenes.summarize', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bß║ín l├á trß╗ú l├╜ ph├ón t├¡ch kß╗ïch bß║ún th├ánh c├íc cß║únh quay. Lu├┤n trß║ú vß╗ü JSON array ScriptPartSummary.',
        },
        {
          role: 'user',
          content: `NHIß╗åM Vß╗ñ: Ph├ón t├¡ch kß╗ïch bß║ún th├ánh c├íc cß║únh quay chi tiß║┐t.
PHONG C├üCH H├îNH ß║óNH: professional financial aesthetic.
Bß║«T BUß╗ÿC Sß╗¼ Dß╗ñNG Mß║¬U PROMPT N├ÇY cho tr╞░ß╗¥ng 'imagePrompt':
${FINANCE_VISUAL_TEMPLATE}
(Thay thß║┐ [INSERT IMAGE CONTENT HERE] bß║▒ng nß╗Öi dung m├┤ tß║ú cß╗Ñ thß╗â cho tß╗½ng cß║únh)

Y├èU Cß║ªU ─Éß╗èNH Dß║áNG: Trß║ú vß╗ü mß╗Öt mß║úng JSON c├íc ─æß╗æi t╞░ß╗úng ScriptPartSummary.
Cß║Ñu tr├║c mß╗ùi ScriptPartSummary:
{
    "partTitle": "T├¬n phß║ºn",
    "scenes": [
        {
            "sceneNumber": 1,
            "summary": "T├│m tß║»t ngß║»n gß╗ìn nß╗Öi dung cß║únh",
            "imagePrompt": "FULL_PROMPT_STRING_FOLLOWING_TEMPLATE",
            "videoPrompt": "Prompt ch╞░a ─æ╞░ß╗úc tß║ío."
        }
    ]
}

Kß╗èCH Bß║óN Cß║ªN PH├éN T├ìCH:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.video.single', {
  version: V1,
  build({ scene }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bß║ín tß║ío prompt video tiß║┐ng Anh chuy├¬n nghiß╗çp vß╗ü t├ái ch├¡nh.',
        },
        {
          role: 'user',
          content: `Tß║ío video prompt (Tiß║┐ng Anh) cho cß║únh quay t├ái ch├¡nh: "${scene.summary}". Tß║¡p trung v├áo m├┤i tr╞░ß╗¥ng l├ám viß╗çc chuy├¬n nghiß╗çp, biß╗âu ─æß╗ô, kh├┤ng gian s├íng sß╗ºa v├á n─âng ─æß╗Öng.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.score', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bß║ín l├á chuy├¬n gia thß║⌐m ─æß╗ïnh nß╗Öi dung k├¬nh "Ch├║ Que T├ái Ch├¡nh".',
        },
        {
          role: 'user',
          content: `H├úy chß║Ñm ─æiß╗âm kß╗ïch bß║ún n├áy dß╗▒a tr├¬n 8 ti├¬u ch├¡ cß╗▒c kß╗│ khß║»t khe:
    1. C├│ sß╗¡ dß╗Ñng c├óu Slogan "Ch├║ Que T├ái Ch├¡nh" v├á c├│ cß║Ñu tr├║c 5 phß║ºn r├╡ r├áng kh├┤ng?
    2. C├│ b├│c t├ích chi ph├¡ bß║▒ng con sß╗æ cß╗Ñ thß╗â, t├¡nh to├ín cß╗Öng trß╗½ nh├ón chia r├╡ r├áng kh├┤ng?
    3. C├│ nhß║»c ─æß║┐n Chi ph├¡ c╞í hß╗Öi hoß║╖c T├óm l├╜ hß╗ìc h├ánh vi (ß║úo gi├íc doanh thu, chi ph├¡ ch├¼m...) kh├┤ng?
    4. Kh├┤ng n├│i l├╜ thuyß║┐t su├┤ng, giß║úi ph├íp c├│ thß╗▒c tiß╗àn (step-by-step) kh├┤ng?
    5. CTA c├│ ─æß║╖t c├óu hß╗Åi thß╗▒c tß║┐ ─æß╗â kh╞íi gß╗úi b├¼nh luß║¡n kh├┤ng?
    6. C├│ tß║ío mß╗Öt nh├ón vß║¡t cß╗Ñ thß╗â (T├¬n + Tuß╗òi + Mß╗⌐c l╞░╞íng) ─æß╗â kß╗â chuyß╗çn kh├┤ng?
    7. C├│ sß╗¡ dß╗Ñng kß╗╣ thuß║¡t Bß║╗ g├úy phß║ún biß╗çn "T├┤i kh├┤ng n├│i... T├┤i ─æang n├│i..." kh├┤ng?
    8. C├│ sß╗¡ dß╗Ñng ß║¿n dß╗Ñ vß║¡t l├╜ (vd: x├┤ thß╗ºng) v├á kß║┐t th├║c bß║▒ng Tß╗Ñc ngß╗»/Th├ánh ngß╗» Viß╗çt Nam kh├┤ng?

Kß╗èCH Bß║óN:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.style.suggest', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bß║ín gß╗úi ├╜ Expression v├á Style cho k├¬nh "Ch├║ Que T├ái Ch├¡nh". Lu├┤n trß║ú JSON.',
        },
        {
          role: 'user',
          content: `Gß╗úi ├╜ Expression v├á Style ph├╣ hß╗úp vß╗¢i k├¬nh "Ch├║ Que T├ái Ch├¡nh" cho chß╗º ─æß╗ü: "${title}". JSON: { "expression": "...", "style": "..." }`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.topics.suggest', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bß║ín gß╗úi ├╜ ├╜ t╞░ß╗ƒng video YouTube t├ái ch├¡nh c├í nh├ón. Lu├┤n trß║ú JSON array.',
        },
        {
          role: 'user',
          content: `Gß╗úi ├╜ 5 ├╜ t╞░ß╗ƒng video YouTube vß╗ü T├ái ch├¡nh c├í nh├ón cho k├¬nh "Ch├║ Que T├ái Ch├¡nh". Bß║»t buß╗Öc tß║ío Ti├¬u ─æß╗ü k├¡ch th├¡ch click chuß╗Öt bß║▒ng 1 trong c├íc c├┤ng thß╗⌐c:
    1. Sß╗▒ Thß║¡t Vß╗ü [Chß╗º ─æß╗ü]: Tß║íi Sao [Nß╗ù lß╗▒c] Vß║½n Thß║Ñt bß║íi?
    2. [Lß╗▒a chß╗ìn A] Hay [Lß╗▒a chß╗ìn B]? T├┤i ─É├ú T├¡nh Ra Con Sß╗æ Thß║¡t.
    3. [Ng├ánh nghß╗ü] 2026: C╞í Hß╗Öi ─Éß╗òi ─Éß╗¥i Hay C├íi Bß║½y?
    Chß╗º ─æß╗ü tham khß║úo: "${title}".
    Trß║ú vß╗ü ─æß╗ïnh dß║íng JSON: [{ "title": "Ti├¬u ─æß╗ü", "outline": "D├án ├╜ ngß║»n" }].`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.keywords.suggest', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bß║ín gß╗úi ├╜ tß╗½ kh├│a SEO cho video t├ái ch├¡nh c├í nh├ón.',
        },
        {
          role: 'user',
          content: `Gß╗úi ├╜ 10 tß╗½ kh├│a SEO (╞░u ti├¬n tiß║┐ng Viß╗çt) cho video t├ái ch├¡nh c├í nh├ón k├¬nh "Ch├║ Que T├ái Ch├¡nh": "${title}".`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.ideas.fromFile', {
  version: V1,
  build({ content }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bß║ín tr├¡ch xuß║Ñt ├╜ t╞░ß╗ƒng video t├ái ch├¡nh c├í nh├ón. Lu├┤n trß║ú JSON array.',
        },
        {
          role: 'user',
          content: `Tr├¡ch xuß║Ñt ├╜ t╞░ß╗ƒng video t├ái ch├¡nh c├í nh├ón tß╗½ nß╗Öi dung file. JSON: { title, outline }.\n\nNß╗ÿI DUNG:\n${content}`,
        },
      ],
    };
  },
});
