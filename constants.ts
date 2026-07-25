
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
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
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
    },
    {
        title: "Làm thế nào để sống sót với 10 triệu đồng/tháng tại thành phố lớn?",
        outline: "Cẩm nang sinh tồn thực tế cho sinh viên mới ra trường và người trẻ. Chiến lược quản lý ngân sách siêu chặt chẽ, tối ưu hóa chi phí thuê nhà, ăn uống và đi lại."
    },
    {
        title: "1 Tỷ đầu tiên: Hành trình gian nan và cách vượt qua",
        outline: "Vì sao Charlie Munger nói '100.000 USD đầu tiên là một con khốn'. Phân tích tâm lý và chiến lược tích lũy để đạt được cột mốc tài sản đầu tiên một cách nhanh nhất."
    },
    {
        title: "Tiêu xài theo cảm xúc (Emotional Spending) và cách chữa trị",
        outline: "Phân tích nguyên nhân tâm lý đằng sau những đợt mua sắm 'trả thù' khi buồn chán hoặc stress. 3 bước thiết thực để ngắt kết nối giữa cảm xúc và chiếc ví của bạn."
    },
    {
        title: "Quy tắc 24h: Mẹo tâm lý để chống lại 'vung tay quá trán'",
        outline: "Cách trì hoãn sự sung sướng bằng luật 24 giờ. Cơ chế hoạt động của não bộ khi khao khát mua sắm và làm thế nào một ngày chờ đợi có thể cứu bạn khỏi những khoản nợ vô hình."
    },
    {
        title: "Side Hustle: Kiếm thêm 5-10 triệu/tháng ngoài giờ hành chính",
        outline: "Tổng hợp các ý tưởng nghề tay trái thực tế (Freelance, Affiliate, Sáng tạo nội dung) không đòi hỏi quá nhiều vốn. Cách cân bằng thời gian để không ảnh hưởng đến công việc chính."
    },
    {
        title: "Đòn bẩy Tài chính (Opm - Other People's Money): Vũ khí của giới tỷ phú",
        outline: "Khái niệm sử dụng tiền của người khác để làm giàu. Cách những nhà đầu tư sành sỏi dùng nợ ngân hàng làm đòn bẩy gia tăng tài sản, và những rủi ro 'cháy túi' đi kèm."
    },
    {
        title: "3 Sai lầm tài chính lớn nhất tuổi 20 bạn nhất định phải tránh",
        outline: "Tổng hợp những cú vấp ngã phổ biến: Không tiết kiệm sớm, mua tiêu sản đắt tiền để khoe mẽ, và phớt lờ sức mạnh của lãi kép. Lời khuyên từ những người đi trước."
    },
    {
        title: "Chơi Hụi (Họ, Biêu, Phường): Văn hóa truyền thống hay Cạm bẫy rủi ro?",
        outline: "Giải thích cơ chế của việc chơi hụi dưới góc nhìn tài chính. Phân tích bài toán lợi nhuận so với rủi ro vỡ hụi, giật hụi và các lựa chọn thay thế an toàn hơn."
    },
    {
        title: "Mua sắm trả góp 0%: Cái bẫy ngọt ngào của các sàn thương mại",
        outline: "Sự thật đằng sau những lời mời chào trả góp 0%. Cách các công ty tài chính thu lời từ phí chuyển đổi, phí thường niên và bẫy tâm lý khiến bạn chi tiêu nhiều hơn khả năng."
    },
    {
        title: "Có 100 triệu nhàn rỗi nên làm gì để sinh lời an toàn?",
        outline: "Gợi ý các kênh phân bổ vốn cho số tiền 100 triệu: Gửi tiết kiệm, Mua vàng, Chứng chỉ quỹ, Cổ phiếu rổ VN30. Đánh giá ưu nhược điểm từng kênh cho người mới."
    },
    {
        title: "Hiệu ứng Mỏ neo (Anchoring Effect) trong thương lượng giá cả",
        outline: "Cách não bộ bị đánh lừa bởi con số đầu tiên được đưa ra. Áp dụng hiệu ứng mỏ neo để đàm phán lương, mua nhà, mua xe hoặc từ chối những chiêu trò giảm giá ảo."
    },
    {
        title: "Nghệ thuật Bán hàng: Kỹ năng sinh tồn số 1 của người giàu",
        outline: "Tại sao tỷ phú nào cũng là một người bán hàng xuất sắc? Cách tư duy về bán hàng không phải là 'móc túi' người khác mà là trao đi giá trị và giải quyết vấn đề."
    },
    {
        title: "Lương 15 triệu có nên vay mua Ô tô trả góp?",
        outline: "Một bài toán chi tiết mổ xẻ mọi chi phí ẩn của việc nuôi xe lăn bánh (bãi đỗ, bảo hiểm, khấu hao, lãi vay). Lời cảnh tỉnh cho những ai muốn mua xe vì 'sĩ diện'."
    },
    {
        title: "Cổ tức là gì? Xây cỗ máy in tiền bằng Đầu tư ăn cổ tức",
        outline: "Giải thích khái niệm cổ tức và tỷ suất cổ tức (Dividend Yield). Chiến lược chọn lọc các doanh nghiệp 'bò sữa' trả cổ tức đều đặn để tạo dòng tiền thụ động vững chắc."
    },
    {
        title: "Quyền năng của từ 'KHÔNG' trong quản lý tài chính",
        outline: "Làm thế nào để từ chối những cuộc vui tốn kém, những lời mời gọi vay mượn từ người thân mà không mất lòng. Kỷ luật bảo vệ chiếc ví của chính mình."
    },
    {
        title: "Mối liên hệ bất ngờ giữa Sức khỏe Thể chất và Sức khỏe Tài chính",
        outline: "Sự thật: Giường bệnh là chiếc giường đắt nhất thế giới. Tại sao đầu tư vào giấc ngủ, ăn uống lành mạnh và tập thể dục lại giúp bạn tiết kiệm hàng trăm triệu đồng viện phí."
    },
    {
        title: "Network is Net worth (Quan hệ là Tiền tệ): Đầu tư vào con người",
        outline: "Tầm quan trọng của việc xây dựng mạng lưới quan hệ chất lượng. Cách phân bổ ngân sách 'giao tiếp' để gặp gỡ những người giỏi hơn và mở ra các cơ hội thăng tiến."
    },
    {
        title: "Vòng luẩn quẩn của sự nghèo đói (Poverty Trap) và cách phá vỡ",
        outline: "Phân tích những rào cản hệ thống khiến người nghèo khó thoát nghèo (thiếu thông tin, nợ lãi cao, thiếu vốn). Chiến lược cá nhân để vượt qua nghịch cảnh và vươn lên."
    },
    {
        title: "Sự tĩnh lặng khi thị trường hoảng loạn: Bài học từ sói già phố Wall",
        outline: "Tâm lý hành vi khi thị trường chứng khoán sập đỏ lửa. Cách rèn luyện tinh thần thép, tắt app và tìm kiếm cơ hội 'mua tài sản giá rẻ' khi người khác sợ hãi."
    },
    {
        title: "Khi nào nên Bán cổ phiếu? Kỷ luật Cắt lỗ và Chốt lời",
        outline: "Đa số mọi người biết khi nào nên mua nhưng lại mù tịt khi nào nên bán. Nguyên tắc bán theo phân tích cơ bản, kỹ thuật và cách loại bỏ cảm xúc 'tiếc nuối'."
    },
    {
        title: "Bảo hiểm Y tế tự nguyện: Tấm khiên rẻ nhất nhưng quyền lực nhất",
        outline: "Đừng vội mua bảo hiểm nhân thọ tiền chục triệu nếu chưa có Bảo hiểm y tế Nhà nước. Cách tận dụng BHYT để giảm đến 80% gánh nặng viện phí khi rủi ro ập tới."
    },
    {
        title: "Xây dựng Thương hiệu cá nhân (Personal Branding) để nhân 3 thu nhập",
        outline: "Trong thời đại Digital, uy tín cá nhân là một tài sản có thể quy ra tiền. Cách sử dụng mạng xã hội chuyên nghiệp để thu hút nhà tuyển dụng và khách hàng tiềm năng."
    },
    {
        title: "Đầu tư Đất nền vùng ven: Góc khuất phân lô bán nền",
        outline: "Lợi nhuận x2, x3 từ đất nền có thật không? Cảnh báo các bẫy quy hoạch, pháp lý, sổ chung và tính thanh khoản bằng không mà cò đất không bao giờ nói cho bạn."
    },
    {
        title: "Có nên cho người thân, bạn bè vay tiền? Nguyên tắc để không mất cả hai",
        outline: "Góc nhìn tài chính về việc cho vay mượn trong các mối quan hệ thân thiết. Quy tắc bất thành văn: Chỉ cho vay số tiền bạn sẵn sàng mất, và cách từ chối khéo léo."
    },
    {
        title: "Quản lý ngân sách bằng Spreadsheet (Excel/Google Sheets) thần thánh",
        outline: "Bỏ qua các app phức tạp, tại sao một bảng tính Excel đơn giản lại là công cụ quyền lực nhất? Hướng dẫn tự thiết kế bảng theo dõi thu chi phù hợp với bản thân."
    },
    {
        title: "Sức mạnh của Tư duy Dài hạn (Long-term thinking) trong thế giới vội vã",
        outline: "Sự khác biệt giữa tư duy 'mì ăn liền' và tư duy trồng cây cổ thụ. Áp dụng tư duy dài hạn vào việc chọn nghề, chọn bạn đời và xây dựng danh mục đầu tư."
    },
    {
        title: "Tài chính cho người sắp Ly hôn: Bảo vệ tài sản hợp pháp",
        outline: "Những vấn đề nhạy cảm nhưng thực tế khi hôn nhân đổ vỡ. Cách chuẩn bị hồ sơ tài chính, phân chia nợ nần và tài sản chung một cách minh bạch, đúng luật."
    },
    {
        title: "Định luật Parkinson: Tại sao bạn luôn tiêu hết những gì kiếm được?",
        outline: "Lý giải hiện tượng 'công việc luôn nở ra để lấp đầy thời gian' áp dụng vào tiền bạc: 'Chi tiêu luôn nở ra để lấp đầy thu nhập'. Cách phá vỡ định luật này."
    },
    {
        title: "Chiến lược trả nợ bằng phương pháp Quả Cầu Tuyết (Snowball)",
        outline: "Hướng dẫn chi tiết cách thanh toán các khoản nợ từ nhỏ đến lớn để tạo động lực tâm lý (Quick wins). Tại sao đôi khi toán học phải nhường bước cho tâm lý học."
    },
    {
        title: "Tự do tài chính không có nghĩa là 'Không làm gì cả'",
        outline: "Xóa bỏ ảo tưởng về việc nằm dài trên bãi biển uống cocktail cả đời. Ý nghĩa thực sự của tự do tài chính là quyền 'Lựa chọn' công việc bạn yêu thích mà không vì tiền."
    },
    {
        title: "Quy tắc 50/30/20 có còn phù hợp với thời giá hiện nay?",
        outline: "Đánh giá lại quy tắc quản lý tài chính kinh điển. Cách biến tấu và linh hoạt điều chỉnh tỷ lệ này khi lạm phát cao và chi phí thuê nhà chiếm quá nửa thu nhập."
    },
    {
        title: "Đầu tư vào giáo dục con cái: Bài toán kinh tế và Tình yêu thương",
        outline: "Trường quốc tế hay trường công? Các quỹ học vấn tương lai. Cách tính toán chi phí nuôi dạy con và giáo dục tài chính cho trẻ từ sớm để chúng tự lập."
    },
    {
        title: "Kinh doanh Online vốn 0 đồng: Sự thật hay những lời hứa hẹn ảo?",
        outline: "Phân biệt giữa Dropshipping, Affiliate Marketing chân chính và các mô hình lùa gà khóa học. Những kỹ năng thực sự cần có để kiếm tiền trên Internet."
    },
    {
        title: "Phân tích Chi phí - Lợi ích (Cost-Benefit) áp dụng vào đời sống",
        outline: "Công cụ tư duy của các CEO. Hướng dẫn cách lập bảng so sánh thiệt hơn (Tiền bạc, Thời gian, Cảm xúc) trước khi đưa ra bất kỳ quyết định lớn nào trong đời."
    },
    {
        title: "Làm thế nào để nghỉ hưu với 10 tỷ đồng từ con số 0?",
        outline: "Một lộ trình mô phỏng thực tế bằng những con số. Tính toán mức đóng góp hàng tháng, lãi suất kỳ vọng và thời gian để đạt được cột mốc 10 tỷ an hưởng tuổi già."
    },
    {
        title: "Sổ tiết kiệm vs Tiết kiệm linh hoạt trên Ví điện tử",
        outline: "So sánh hiệu quả và tính an toàn giữa việc gửi tiết kiệm ngân hàng truyền thống và các sản phẩm sinh lời theo ngày trên MoMo, ZaloPay, ViettelPay."
    },
    {
        title: "Bẫy thu nhập trung bình (Middle-income trap) ở cấp độ cá nhân",
        outline: "Tại sao nhiều người kẹt ở mức lương 20-30 triệu suốt nhiều năm mà không thể bứt phá. Cách nâng cấp kỹ năng (Upskill) để nhảy vọt lên phân khúc thu nhập cao."
    },
    {
        title: "Thiết lập Quỹ Khẩn Cấp trong thời kỳ lạm phát cao",
        outline: "Nên để bao nhiêu tiền mặt khi tiền đang mất giá? Cách phân bổ Quỹ khẩn cấp thành nhiều tầng (Tiền mặt, Gửi không kỳ hạn, Gửi kỳ hạn ngắn) để tối ưu lãi."
    },
    {
        title: "Hiệu ứng Hào quang (Halo Effect) trong việc chọn chuyên gia tài chính",
        outline: "Đừng mù quáng tin vào những 'Thầy bà' mặc vest, đi xe sang trên mạng. Cách đánh giá một lời khuyên tài chính có thực sự chất lượng hay chỉ là phông bạt."
    },
    {
        title: "Khám phá bí mật về 'Lãi suất Thực' (Real Interest Rate)",
        outline: "Lãi suất danh nghĩa trừ đi Lạm phát. Tại sao gửi ngân hàng lãi 6%/năm nhưng lạm phát 4% thì bạn chỉ thực sự nhận được 2% giá trị tăng thêm."
    },
    {
        title: "Thương hiệu cao cấp (Luxury Brands) và thuế đánh vào sự phù phiếm",
        outline: "Phân tích mô hình kinh doanh của các thương hiệu xa xỉ. Tại sao việc mua đồ hiệu bằng thẻ tín dụng là cách nhanh nhất để phá hủy tương lai tài chính của bạn."
    },
    {
        title: "Cân bằng giữa Tích lũy cho tương lai và Sống cho hiện tại (YOLO)",
        outline: "Ranh giới mong manh giữa tiết kiệm cực đoan (khổ hạnh) và tiêu xài hoang phí. Hướng dẫn cách phân bổ quỹ 'Play' để tự thưởng cho bản thân không hối tiếc."
    },
    {
        title: "Đọc vị các bản hợp đồng: Thói quen cứu bạn khỏi những vụ lừa đảo",
        outline: "Tầm quan trọng của việc soi kỹ 'dòng chữ nhỏ' (Fine print) trong hợp đồng vay vốn, hợp đồng bảo hiểm và mua bán nhà đất. Những rủi ro pháp lý cần tránh."
    },
    {
        title: "Chiến lược Mua sỉ, Dùng chung để chống bão giá",
        outline: "Kinh tế chia sẻ áp dụng vào cá nhân. Lợi ích tài chính của việc mua chung tài khoản Netflix, Spotify, mua hàng sỉ hoặc chia sẻ chi phí thuê nhà với người khác."
    },
    {
        title: "Hiểu về vòng quay kinh tế: Hưng thịnh, Suy thoái và Khủng hoảng",
        outline: "Kiến thức vĩ mô cơ bản nhưng sống còn. Cách nhận biết chúng ta đang ở đâu trong chu kỳ kinh tế để quyết định nên tấn công (đầu tư) hay phòng thủ (giữ tiền mặt)."
    },
    {
        title: "Nghề Reviewer/KOL: Hào quang mạng xã hội và góc khuất thu nhập",
        outline: "Giải mã cách các nhà sáng tạo nội dung kiếm tiền từ nhãn hàng. Những bất ổn tài chính khi thu nhập phụ thuộc vào thuật toán của nền tảng (TikTok, YouTube)."
    },
    {
        title: "Môn học Tài chính cá nhân: Lỗ hổng lớn nhất của hệ thống giáo dục",
        outline: "Tại sao trường học dạy bạn tính tích phân nhưng không dạy cách tính lãi ngân hàng? Những kiến thức bắt buộc phụ huynh phải tự dạy cho con cái ngay từ nhỏ."
    },
    {
        title: "Quản trị rủi ro toàn diện: Bảo vệ bản thân bằng nhiều lớp khiên",
        outline: "Tóm lược bộ 3 bảo vệ tài chính hoàn hảo: Quỹ khẩn cấp (Ngắn hạn) - Bảo hiểm y tế/nhân thọ (Rủi ro bất trắc) - Danh mục đầu tư đa dạng (Lạm phát và tương lai dài hạn)."
    }
];
