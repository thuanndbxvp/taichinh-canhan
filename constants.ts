
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
    },
    {
        title: "FIRE (Độc lập tài chính, Nghỉ hưu sớm): Giấc mơ hay Ảo tưởng?",
        outline: "Phân tích trào lưu FIRE. Hướng dẫn cách tính con số FIRE (quy tắc 4%) và chiến lược gia tăng tỷ lệ tiết kiệm để đạt tự do tài chính trước tuổi 40."
    },
    {
        title: "Quy tắc 6 chiếc lọ tài chính: Bí quyết quản lý tiền đỉnh cao",
        outline: "Giới thiệu phương pháp quản lý tài chính JARS của T. Harv Eker. Cách chia thu nhập thành 6 quỹ: Nhu cầu thiết yếu, Giáo dục, Hưởng thụ, Tự do tài chính, Tiết kiệm dài hạn và Cho đi."
    },
    {
        title: "Mua nhà hay Thuê nhà? Bài toán kinh tế ít người dám tính",
        outline: "Phân tích ưu nhược điểm của việc mua nhà trả góp so với thuê nhà và mang tiền đi đầu tư. Cách tính toán dòng tiền để đưa ra quyết định phù hợp với hoàn cảnh cá nhân."
    },
    {
        title: "Bảo hiểm nhân thọ: Tấm khiên bảo vệ hay khoản đầu tư tồi?",
        outline: "Bóc tách sự thật về bảo hiểm nhân thọ. Sự khác biệt giữa bảo hiểm thuần túy và bảo hiểm liên kết đầu tư. Khi nào nên mua và mua bao nhiêu là đủ?"
    },
    {
        title: "Pay Yourself First (Trả cho mình trước): Nguyên tắc số 1 của người giàu",
        outline: "Tại sao việc trích một phần thu nhập để tiết kiệm/đầu tư NGAY khi vừa nhận lương lại thay đổi cuộc đời bạn. Hướng dẫn thiết lập hệ thống tiết kiệm tự động."
    },
    {
        title: "Lạm Phát: Kẻ móc túi thầm lặng của người thích gửi tiết kiệm",
        outline: "Giải thích cơ chế của lạm phát và cách nó bào mòn sức mua của tiền mặt theo thời gian. Chiến lược đầu tư để chiến thắng lạm phát."
    },
    {
        title: "Phân bổ tài sản: Quy tắc 100 trừ đi số tuổi",
        outline: "Cách xây dựng danh mục đầu tư dựa trên độ tuổi và khẩu vị rủi ro. Tỷ lệ vàng giữa cổ phiếu (rủi ro cao) và trái phiếu (an toàn) để tối ưu hóa lợi nhuận."
    },
    {
        title: "Đầu tư Định kỳ (DCA): Chiến lược nhàm chán nhưng hiệu quả nhất",
        outline: "Giới thiệu phương pháp Trung bình giá (Dollar-Cost Averaging). Tại sao việc đầu tư đều đặn mỗi tháng lại vượt trội hơn việc cố gắng 'bắt đáy, bán đỉnh' thị trường."
    },
    {
        title: "Tài sản và Tiêu sản: Bài học vỡ lòng từ 'Cha giàu Cha nghèo'",
        outline: "Phân biệt rõ ràng giữa thứ bỏ tiền vào túi bạn (Tài sản) và thứ lấy tiền ra khỏi túi bạn (Tiêu sản). Tại sao người nghèo mua tiêu sản, người giàu mua tài sản."
    },
    {
        title: "Bẫy tâm lý FOMO trong đầu tư: Đu đỉnh và bài học đắt giá",
        outline: "Phân tích hội chứng Sợ bỏ lỡ (Fear Of Missing Out). Cách nhận biết đám đông đang hưng phấn và chiến lược giữ cái đầu lạnh khi thị trường biến động mạnh."
    },
    {
        title: "Chi phí cơ hội: Khái niệm định hình mọi quyết định tài chính",
        outline: "Giải thích chi phí cơ hội là gì. Tại sao việc chọn mua một chiếc iPhone mới hôm nay có thể đánh đổi bằng hàng trăm triệu đồng trong 10 năm tới."
    },
    {
        title: "Quy tắc 72: Nhẩm tính thời gian nhân đôi tài sản trong 3 giây",
        outline: "Công thức toán học thần thánh của dân tài chính. Hướng dẫn cách dùng Quy tắc 72 để đánh giá nhanh hiệu quả của một kênh đầu tư."
    },
    {
        title: "Chứng chỉ quỹ mở: Cách người bận rộn thuê chuyên gia đầu tư",
        outline: "Khái niệm quỹ mở là gì? Ưu điểm khi ủy thác vốn cho các chuyên gia tài chính. Cách chọn một chứng chỉ quỹ uy tín và phù hợp với mục tiêu."
    },
    {
        title: "Chi phí chìm (Sunk Cost Fallacy): Tại sao chúng ta cố chấp giữ khoản lỗ?",
        outline: "Giải mã hiệu ứng tâm lý khiến nhà đầu tư không dám 'cắt lỗ' hoặc tiếp tục đổ tiền vào dự án không hiệu quả. Cách vượt qua bẫy chi phí chìm."
    },
    {
        title: "Bẫy thẻ tín dụng: Từ tiện ích đến vòng xoáy nợ nần",
        outline: "Cách các ngân hàng kiếm tiền từ thẻ tín dụng. Các cạm bẫy như 'thanh toán tối thiểu', phí phạt trễ hạn và chiến lược dùng thẻ để tận dụng ưu đãi mà không mất tiền oan."
    },
    {
        title: "Tài chính vợ chồng: Tiền chung hay Tiền riêng?",
        outline: "Các mô hình quản lý tài chính trong gia đình. Cách trao đổi minh bạch về tiền bạc với bạn đời để tránh xung đột và cùng nhau xây dựng sự thịnh vượng."
    },
    {
        title: "Đầu tư vào bản thân: Kênh đầu tư có ROI cao nhất",
        outline: "Tại sao nâng cao kỹ năng, học ngoại ngữ hay chăm sóc sức khỏe lại là khoản đầu tư không bao giờ lỗ. Cách định giá bản thân để đàm phán lương hiệu quả."
    },
    {
        title: "Thu nhập Thụ động vs Chủ động: Xây dựng đường ống nước",
        outline: "Sự khác biệt giữa việc xách nước (làm công ăn lương) và xây đường ống (tạo nguồn thu thụ động). Các ý tưởng tạo thu nhập thụ động thiết thực cho người trẻ."
    },
    {
        title: "Quản lý tài chính cho Freelancer (Người làm tự do)",
        outline: "Những khó khăn khi dòng tiền không đều đặn mỗi tháng. Chiến lược lập ngân sách, đóng thuế và tự xây dựng quỹ hưu trí cho freelancer."
    },
    {
        title: "Hiệu ứng Chim mồi (Decoy Effect) trong tiêu dùng",
        outline: "Phân tích cách các siêu thị, quán cafe thao túng tâm lý người mua bằng việc đưa ra các mức giá mồi. Bí kíp nhận diện và từ chối chi tiêu không cần thiết."
    },
    {
        title: "Kế hoạch tài chính cho người độc thân",
        outline: "Lợi thế và thách thức tài chính của người chưa lập gia đình. Cách lập kế hoạch mua nhà, mua bảo hiểm và chuẩn bị cho tương lai xa mà không phụ thuộc vào ai."
    },
    {
        title: "Chuẩn bị tài chính trước khi sinh con: Đừng để tiền làm mờ niềm vui",
        outline: "Những khoản chi phí khổng lồ khi có em bé mà ít người tính đến. Các bước chuẩn bị ngân sách thai sản, bỉm sữa và quỹ giáo dục từ sớm."
    },
    {
        title: "Trái phiếu doanh nghiệp: Lợi nhuận cao đi kèm rủi ro gì?",
        outline: "Khái niệm trái phiếu, sự khác biệt giữa trái phiếu chính phủ và doanh nghiệp. Cách đọc hiểu bản cáo bạch và đánh giá rủi ro vỡ nợ trước khi mua."
    },
    {
        title: "Tính Thanh Khoản: Tại sao người giàu bất động sản vẫn có thể phá sản?",
        outline: "Định nghĩa thanh khoản (khả năng chuyển đổi thành tiền mặt). Tầm quan trọng của việc duy trì tài sản có tính thanh khoản cao để ứng phó với khủng hoảng."
    },
    {
        title: "Crypto (Tiền mã hóa): Tương lai tài chính hay Sòng bạc công nghệ?",
        outline: "Cái nhìn khách quan về Bitcoin và tiền mã hóa. Những nguyên tắc cốt lõi khi tham gia thị trường rủi ro cao: Chỉ đầu tư số tiền có thể mất và cách lưu trữ an toàn."
    },
    {
        title: "Quỹ hưu trí tự nguyện: Lo xa không bao giờ thừa",
        outline: "Tại sao lương hưu BHXH có thể không đủ để bạn sống an nhàn? Tìm hiểu về quỹ hưu trí bổ sung tự nguyện và sức mạnh của việc tích lũy từ sớm."
    },
    {
        title: "Nghệ thuật đàm phán lương: Đừng để bản thân bị định giá thấp",
        outline: "Các kỹ năng chuẩn bị trước buổi phỏng vấn đánh giá năng lực. Cách nghiên cứu thị trường, nêu bật giá trị bản thân và chiến lược deal lương win-win."
    },
    {
        title: "Báo cáo tài chính cá nhân: Bắt mạch sức khỏe dòng tiền",
        outline: "Cách lập Bảng Cân Đối Kế Toán và Báo Cáo Kết Quả Kinh Doanh cho chính bạn. 3 chỉ số quan trọng cần theo dõi: Giá trị tài sản ròng, Tỷ lệ tiết kiệm và Tỷ lệ nợ/tài sản."
    },
    {
        title: "Cạm bẫy 'Làm giàu nhanh' (Get-rich-quick schemes)",
        outline: "Dấu hiệu nhận biết các mô hình Ponzi, đa cấp lừa đảo núp bóng đầu tư tài chính. Khẳng định chân lý: Lợi nhuận cao không rủi ro là lời nói dối."
    },
    {
        title: "Đầu tư chứng khoán với vốn nhỏ: Bắt đầu từ 1 triệu đồng",
        outline: "Xóa bỏ định kiến 'phải có nhiều tiền mới đầu tư được'. Các bước mở tài khoản, chọn mua cổ phiếu lô lẻ hoặc ETF với số vốn khiêm tốn mỗi tháng."
    },
    {
        title: "Quản lý nợ vay mua nhà: Trả bớt gốc sớm hay mang tiền đi đầu tư?",
        outline: "Phân tích bài toán lợi ích giữa việc dồn tiền trả nợ ngân hàng để giảm lãi và việc mang số tiền đó đi đầu tư sinh lời. Khi nào nên tất toán sớm?"
    },
    {
        title: "Tự do tài chính có thực sự mang lại hạnh phúc?",
        outline: "Góc nhìn sâu sắc về mục đích cuối cùng của việc kiếm tiền. Tiền là phương tiện, không phải đích đến. Cách cân bằng giữa việc tích lũy và tận hưởng cuộc sống hiện tại."
    },
    {
        title: "Bí quyết tiết kiệm tiền khi đi du lịch",
        outline: "Cách lập kế hoạch tài chính cho chuyến đi xa. Kỹ năng săn vé rẻ, chọn chỗ ở hợp lý và quản lý chi tiêu để có trải nghiệm tuyệt vời mà không 'lủng ví'."
    },
    {
        title: "Hiệu ứng Dunning-Kruger: Kẻ thù của nhà đầu tư F0",
        outline: "Giải thích ảo tưởng sức mạnh của người mới bước chân vào thị trường tài chính. Tại sao việc biết một chút thường nguy hiểm hơn là không biết gì, và cách rèn luyện sự khiêm tốn."
    },
    {
        title: "Thói quen nhỏ, Tài sản to (Bản lề của nguyên tử)",
        outline: "Ứng dụng cuốn sách 'Atomic Habits' vào tài chính. Làm thế nào một thay đổi nhỏ bé như tự pha cafe thay vì mua ngoài có thể thay đổi cục diện tài chính trong dài hạn."
    },
    {
        title: "Đầu tư Vàng: Kênh trú ẩn an toàn qua các thời kỳ",
        outline: "Đặc tính lịch sử của vàng. Tại sao vàng luôn tăng giá trong dài hạn và khủng hoảng. Cách phân bổ một tỷ lệ hợp lý của danh mục vào kim loại quý."
    },
    {
        title: "Tâm lý bầy đàn trong đầu tư chứng khoán",
        outline: "Tại sao đám đông thường sai ở những điểm xoay chiều của thị trường. Cách nhận diện sự điên rồ của đám đông và chiến lược đầu tư ngược chiều (Contrarian investing)."
    },
    {
        title: "Chi phí ẩn của việc sở hữu ô tô",
        outline: "Phân tích bài toán tài chính đằng sau chiếc xe hơi. Khấu hao, phí bảo trì, bảo hiểm, bãi đỗ... Tại sao ô tô là một trong những tiêu sản lớn nhất của người trẻ."
    },
    {
        title: "Khủng hoảng tuổi 30: Áp lực đồng trang lứa (Peer pressure)",
        outline: "Làm sao để vượt qua cảm giác tự ti khi thấy bạn bè xung quanh mua nhà, mua xe. Cách tập trung vào đường đua của riêng mình và định nghĩa lại thành công."
    },
    {
        title: "Sức mạnh của Lãi suất Kép trong việc trả nợ",
        outline: "Góc tối của lãi kép. Khi bạn nợ, lãi kép làm việc chống lại bạn như thế nào. Chiến lược ưu tiên trả các khoản nợ có lãi suất cao nhất (Avalanche method)."
    },
    {
        title: "Tài chính cho sinh viên mới ra trường",
        outline: "Cẩm nang sinh tồn tài chính trong những năm tháng lương thấp. Cách thiết lập thói quen chi tiêu chuẩn mực ngay từ tháng lương đầu tiên."
    },
    {
        title: "Hiểu đúng về Chỉ số P/E khi chọn cổ phiếu",
        outline: "Khái niệm Price-to-Earnings. Cổ phiếu P/E thấp có phải luôn rẻ? Cổ phiếu P/E cao có phải luôn đắt? Cách dùng P/E để định giá sơ bộ doanh nghiệp."
    },
    {
        title: "Cách vượt qua khủng hoảng tài chính cá nhân (Mất việc, Phá sản)",
        outline: "Các bước thiết thực để đứng lên sau biến cố. Cách cắt giảm chi phí tối đa, thương lượng giãn nợ và tìm kiếm nguồn thu nhập thay thế trong ngắn hạn."
    },
    {
        title: "Đầu tư giá trị vs Đầu tư tăng trưởng",
        outline: "So sánh hai trường phái đầu tư kinh điển. Tìm hiểu phong cách của Warren Buffett (Giá trị) và Peter Lynch (Tăng trưởng) để áp dụng vào danh mục cá nhân."
    },
    {
        title: "Thuế Thu nhập Cá nhân: Những điều người lao động cần biết",
        outline: "Cách tính thuế TNCN cơ bản. Các khoản giảm trừ gia cảnh và phương pháp hợp pháp để tối ưu hóa số thuế phải nộp hằng năm."
    },
    {
        title: "Bất động sản dòng tiền: Trái ngọt hay cục nợ?",
        outline: "Tìm hiểu mô hình xây nhà trọ, căn hộ dịch vụ cho thuê. Phân tích bài toán chi phí quản lý, khấu hao và lợi suất cho thuê so với lãi suất ngân hàng."
    },
    {
        title: "Tâm lý học về tiền bạc (The Psychology of Money)",
        outline: "Tóm tắt những bài học đắt giá từ cuốn sách cùng tên của Morgan Housel. Tại sao sự giàu có phụ thuộc vào hành vi của bạn nhiều hơn là sự thông minh."
    },
    {
        title: "Khởi nghiệp (Startup) bằng tiền túi (Bootstrapping) hay gọi vốn?",
        outline: "Bài toán tài chính cho người bắt đầu kinh doanh. Lợi thế của việc tự làm tự ăn so với việc chia sẻ cổ phần cho các quỹ đầu tư."
    },
    {
        title: "Thiết kế lối sống tối giản (Minimalism) để tự do tài chính",
        outline: "Sự liên hệ mật thiết giữa lối sống tối giản và sự giàu có. Cách loại bỏ những thứ không mang lại niềm vui để có thêm nguồn lực cho những mục tiêu lớn hơn."
    }
];
