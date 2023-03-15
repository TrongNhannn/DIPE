const jwt = require('jsonwebtoken');
// Middleware để xác thực token
function verifyToken(req, res, next) {
  // Lấy token từ header của request
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ success:false ,content: 'Lỗi! Không nhận được mã token' });
  }
  // Xác thực token
  jwt.verify(token, 'your-jwt-secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success:false,content: 'Mã token không hợp lệ' });
    }
    // Lưu thông tin user vào request để sử dụng ở các endpoint khác
    req.user = decoded;
    next();
  });
}
module.exports = {
  verifyToken: verifyToken,
}