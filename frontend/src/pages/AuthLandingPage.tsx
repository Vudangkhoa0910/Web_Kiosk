import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, ArrowLeft, Home } from 'lucide-react';

const AuthLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200 hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="relative">
                  <img
                    src="/images/Bulldog/1.png"
                    alt="Alpha Asimov Robot"
                    className="w-[450px] h-[450px] object-contain filter drop-shadow-2xl"
                  />
                </div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                ALPHA<span className="text-gray-700">ASIMOV</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Hệ thống robot giao hàng thông minh tiên tiến nhất. 
                Trải nghiệm tương lai ngay hôm nay!
              </p>
            </div>
          </div>

          {/* Right Side - Auth Options */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Bắt đầu ngay</h2>
                <p className="text-gray-600">Chọn tùy chọn phù hợp với bạn</p>
              </div>

              <div className="space-y-4">
                {/* Login Option */}
                <Link
                  to="/login"
                  className="group flex items-center justify-between w-full p-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <LogIn className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Đăng nhập</h3>
                      <p className="text-gray-300 text-sm">Bạn đã có tài khoản</p>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-white transition-colors">
                    →
                  </div>
                </Link>

                {/* Register Option */}
                <Link
                  to="/register"
                  className="group flex items-center justify-between w-full p-6 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-900 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <UserPlus className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Đăng ký</h3>
                      <p className="text-gray-600 text-sm">Tạo tài khoản mới</p>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-700 transition-colors">
                    →
                  </div>
                </Link>
              </div>

              {/* Guest Access */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">Hoặc</p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                  >
                    <Home className="w-4 h-4" />
                    Tiếp tục không cần tài khoản
                  </Link>
                </div>
              </div>
        </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Demo version - Không cần backend authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLandingPage;