// src/pages/TermsAndConditions.tsx
import React from 'react';
import { Container, Typography, CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

const TermsPrivacyPolicy: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Box>
          <Typography variant='h3' gutterBottom>
            Điều khoản sử dụng & Chính sách bảo mật
          </Typography>

          <Typography variant='h4' component='h1' gutterBottom>
            Điều Khoản Sử Dụng và Chính Sách Bảo Mật
          </Typography>
          <Typography variant='body1' paragraph>
            Cập nhật lần cuối: Ngày 3 tháng 11, 2025
          </Typography>

          <Typography variant='h5' component='h2' gutterBottom>
            1. Điều Khoản Sử Dụng
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            1.1 Chấp Nhận Điều Khoản
          </Typography>
          <Typography variant='body1' paragraph>
            Bằng cách truy cập và sử dụng ứng dụng theo dõi huyết áp và đường
            huyết ("Ứng Dụng ChronoCare"), bạn đồng ý tuân thủ các Điều Khoản Sử
            Dụng này và Chính Sách Bảo Mật của chúng tôi.
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            1.2 Tài Khoản Người Dùng
          </Typography>
          <Typography variant='body1' paragraph>
            - Bạn phải tạo một tài khoản để sử dụng Ứng Dụng
            <br />
            - Bạn có thể đăng nhập bằng xác thực Google hoặc Twitter
            <br />
            - Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản của mình
            <br />
            - Bạn phải cung cấp thông tin chính xác và đầy đủ
            <br />- Bạn chịu trách nhiệm về tất cả các hoạt động xảy ra dưới tài
            khoản của mình
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            1.3 Sử Dụng Được Phép
          </Typography>
          <Typography variant='body1' paragraph>
            Bạn có thể sử dụng Ứng Dụng để:
            <br />
            - Ghi lại các chỉ số huyết áp (huyết áp tâm thu, huyết áp tâm
            trương, và nhịp tim)
            <br />
            - Ghi lại mức đường huyết
            <br />
            - Xem dữ liệu sức khỏe lịch sử của bạn
            <br />
            - Truy cập phân tích xu hướng và biểu đồ
            <br />- Quản lý thông tin sức khỏe cá nhân của bạn
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            1.4 Sử Dụng Cấm
          </Typography>
          <Typography variant='body1' paragraph>
            Bạn không được:
            <br />
            - Chia sẻ thông tin tài khoản của bạn với người khác
            <br />
            - Sử dụng Ứng Dụng cho mục đích bất hợp pháp
            <br />
            - Cố gắng truy cập trái phép vào Ứng Dụng
            <br />
            - Can thiệp vào chức năng của Ứng Dụng
            <br />- Tải lên mã độc hoặc nội dung có hại
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            1.5 Tuyên Bố Y Tế
          </Typography>
          <Typography variant='body1' paragraph>
            - Ứng Dụng không thay thế lời khuyên y tế chuyên nghiệp
            <br />
            - Hãy tham khảo ý kiến các chuyên gia y tế cho các quyết định liên
            quan đến sức khỏe
            <br />
            - Ứng Dụng chỉ dành cho mục đích theo dõi
            <br />- Chúng tôi không chịu trách nhiệm về bất kỳ quyết định sức
            khỏe nào dựa trên dữ liệu của Ứng Dụng
          </Typography>

          <Typography variant='h5' component='h2' gutterBottom>
            2. Chính Sách Bảo Mật
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            2.1 Thông Tin Chúng Tôi Thu Thập
          </Typography>

          <Typography variant='body1' paragraph>
            <strong>2.1.1 Thông Tin Tài Khoản</strong>
            <br />
            - Dữ liệu xác thực từ Google hoặc Twitter
            <br />
            - Địa chỉ email
            <br />- Thông tin hồ sơ
          </Typography>

          <Typography variant='body1' paragraph>
            <strong>2.1.2 Dữ Liệu Sức Khỏe</strong>
            <br />
            - Chỉ số huyết áp (huyết áp tâm thu, huyết áp tâm trương, nhịp tim)
            <br />
            - Mức đường huyết
            <br />- Thời gian và ngày của các chỉ số
          </Typography>

          <Typography variant='body1' paragraph>
            <strong>2.1.3 Dữ Liệu Kỹ Thuật</strong>
            <br />
            - Thông tin thiết bị
            <br />
            - Địa chỉ IP
            <br />
            - Loại trình duyệt
            <br />- Thống kê sử dụng
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            2.2 Cách Chúng Tôi Sử Dụng Thông Tin Của Bạn
          </Typography>

          <Typography variant='body1' paragraph>
            <strong>2.2.1 Mục Đích Chính</strong>
            <br />
            - Cung cấp và duy trì Ứng Dụng
            <br />
            - Lưu trữ các chỉ số sức khỏe của bạn
            <br />
            - Tạo ra các xu hướng và phân tích
            <br />- Xác thực danh tính của bạn
          </Typography>

          <Typography variant='body1' paragraph>
            <strong>2.2.2 Mục Đích Phụ</strong>
            <br />
            - Cải thiện chức năng của Ứng Dụng
            <br />
            - Phân tích các mô hình sử dụng
            <br />
            - Gỡ lỗi các vấn đề kỹ thuật
            <br />- Gửi thông báo quan trọng
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            2.3 Lưu Trữ và Bảo Mật Dữ Liệu
          </Typography>
          <Typography variant='body1' paragraph>
            - Dữ liệu được lưu trữ sử dụng Firebase Database
            <br />
            - Xác thực được xử lý bởi Firebase Auth
            <br />
            - Các biện pháp bảo mật tiêu chuẩn ngành
            <br />- Truyền tải dữ liệu mã hóa
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            2.4 Chia Sẻ Dữ Liệu
          </Typography>
          <Typography variant='body1' paragraph>
            Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba,
            ngoại trừ:
            <br />
            - Khi được yêu cầu bởi pháp luật
            <br />
            - Với sự đồng ý rõ ràng của bạn
            <br />- Với các nhà cung cấp dịch vụ thiết yếu cho hoạt động của Ứng
            Dụng
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            2.5 Quyền Lợi Của Bạn
          </Typography>
          <Typography variant='body1' paragraph>
            Bạn có quyền:
            <br />
            - Truy cập dữ liệu cá nhân của bạn
            <br />
            - Chỉnh sửa dữ liệu không chính xác
            <br />
            - Xóa tài khoản và dữ liệu của bạn
            <br />
            - Xuất dữ liệu sức khỏe của bạn
            <br />- Từ chối các thông báo không cần thiết
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            2.6 Lưu Trữ Dữ Liệu
          </Typography>
          <Typography variant='body1' paragraph>
            - Dữ liệu tài khoản được lưu trữ cho đến khi tài khoản bị xóa
            <br />
            - Dữ liệu sức khỏe được lưu trữ trong suốt thời gian tài khoản hoạt
            động
            <br />- Dữ liệu sao lưu được lưu trữ trong 30 ngày sau khi xóa
          </Typography>

          <Typography variant='h6' component='h3' gutterBottom>
            2.7 Quyền Riêng Tư Của Trẻ Em
          </Typography>
          <Typography variant='body1' paragraph>
            Ứng Dụng không dành cho người dùng dưới 13 tuổi.
          </Typography>

          <Typography variant='h5' component='h2' gutterBottom>
            3. Thay Đổi Điều Khoản và Chính Sách Bảo Mật
          </Typography>
          <Typography variant='body1' paragraph>
            Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Người
            dùng sẽ được thông báo về các thay đổi quan trọng.
          </Typography>

          <Typography variant='h5' component='h2' gutterBottom>
            4. Thông Tin Liên Hệ
          </Typography>
          <Typography variant='body1' paragraph>
            Với các câu hỏi về các điều khoản này hoặc quyền riêng tư của bạn:
            <br />- Email:{' '}
            <a href='mailto:kunsorei5@gmail.com'>kunsorei5@gmail.com</a>
            <br />- Website:{' '}
            <a href='https://chronocare.netlify.app'>chronocare.netlify.app</a>
          </Typography>

          <Typography variant='h5' component='h2' gutterBottom>
            5. Luật Áp Dụng
          </Typography>
          <Typography variant='body1' paragraph>
            Các điều khoản này được điều chỉnh bởi pháp luật của Việt Nam.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default TermsPrivacyPolicy;
