import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

// Define the translations interface
interface Translations {
  // Navigation
  nav: {
    home: string;
    homeDesc: string;
    order: string;
    orderDesc: string;
    tracking: string;
    trackingDesc: string;
    history: string;
    historyDesc: string;
  };
  
  common: {
    systemOnline: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    refresh: string;
  };

  // Authentication
  auth: {
    login: string;
    register: string;
    logout: string;
    welcome_back: string;
    login_subtitle: string;
    register_subtitle: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
    email_placeholder: string;
    password_placeholder: string;
    firstName_placeholder: string;
    lastName_placeholder: string;
    confirmPassword_placeholder: string;
    forgot_password: string;
    remember_me: string;
    logging_in: string;
    registering: string;
    no_account: string;
    have_account: string;
    register_now: string;
    login_now: string;
    reset_password: string;
    send_reset_email: string;
    back_to_login: string;
    password_requirements: string;
    terms_conditions: string;
    privacy_policy: string;
    agree_terms: string;
  };

  // Home Section
  home: {
    welcomeMessage: string;
    subtitle: string;
    welcomeBack: string;
    readyForDelivery: string;
    
    // Content Slides
    slides: {
      whatWeDo: {
        title: string;
        subtitle: string;
        description: string;
        cards: {
          safeAndSmart: {
            title: string;
            description: string;
          };
          streetNavigation: {
            title: string;
            description: string;
          };
          peaceOfMind: {
            title: string;
            description: string;
          };
        };
      };
      ourProduct: {
        title: string;
        subtitle: string;
        description: string;
        cards: {
          smallOnPurpose: {
            title: string;
            description: string;
          };
          consistentDelivery: {
            title: string;
            description: string;
          };
          ecoFriendly: {
            title: string;
            description: string;
          };
        };
      };
      whoWeAre: {
        title: string;
        subtitle: string;
        description: string;
        cards: {
          topTalents: {
            title: string;
            description: string;
          };
          passionateEngineering: {
            title: string;
            description: string;
          };
          rndFocus: {
            title: string;
            description: string;
          };
        };
      };
    };
    
    stats: {
      totalRobots: string;
      activeDeliveries: string;
      completedOrders: string;
      uptime: string;
      totalOrders: string;
      activeRobots: string;
      ordersThisMonth: string;
      totalSaved: string;
      avgDeliveryTime: string;
      vsTradionalDelivery: string;
      fasterThanAverage: string;
      fromLastMonth: string;
    };
    quickActions: {
      title: string;
      placeOrder: string;
      trackDelivery: string;
      liveOrders: string;
      newOrder: string;
      newOrderDesc: string;
      trackRobots: string;
      trackRobotsDesc: string;
      liveOrdersDesc: string;
      orderNow: string;
      orderNowDesc: string;
      trackDeliveryDesc: string;
      browseMap: string;
      browseMapDesc: string;
    };
    recentActivity: string;
    recentOrders: string;
    viewAllOrders: string;
    systemHealth: string;
    cartInProgress: string;
    continueOrder: string;
    whyChooseRobot: string;
    fastReliable: string;
    fastReliableDesc: string;
    available24_7: string;
    available24_7Desc: string;
    ecoFriendly: string;
    ecoFriendlyDesc: string;
    delivering: string;
    completed: string;
    pending: string;
    deliveryProgress: string;
    onTheWay: string;
    items: string;
  };

  // Order Flow Section
  orderFlow: {
    title: string;
    subtitle: string;
    steps: {
      selectRestaurant: string;
      selectItems: string;
      deliveryInfo: string;
      payment: string;
      complete: string;
    };
    restaurant: {
      title: string;
      subtitle: string;
      selectRestaurant: string;
      selectRestaurantDesc: string;
      searchPlaceholder: string;
      categories: {
        all: string;
        fastfood: string;
        cafe: string;
        asian: string;
      };
      noResultsTitle: string;
      noResultsDesc: string;
    };
    menu: {
      title: string;
      subtitle: string;
      selectItems: string;
      selectItemsDesc: string;
      cart: string;
      total: string;
      addToCart: string;
      quantity: string;
      removeItem: string;
      noItems: string;
      noItemsDesc: string;
    };
    delivery: {
      title: string;
      subtitle: string;
      customerName: string;
      customerPhone: string;
      notes: string;
      notesPlaceholder: string;
    };
    payment: {
      title: string;
      subtitle: string;
      selectMethod: string;
      qrCode: string;
      qrCodeDesc: string;
      momo: string;
      momoDesc: string;
      orderSummary: string;
      deliveryFee: string;
      free: string;
      bankInfo: string;
      bank: string;
      accountNumber: string;
      accountName: string;
      amount: string;
      momoTitle: string;
      momoInstructions: string;
      momoSteps: string;
      processing: string;
      waitingConfirmation: string;
      waitingConfirmationDesc: string;
      processingPayment: string;
      processingPaymentDesc: string;
    };
    success: {
      title: string;
      subtitle: string;
      orderId: string;
      trackOrder: string;
      placeAnother: string;
    };
    buttons: {
      back: string;
      next: string;
      placeOrder: string;
      processing: string;
      startUsing: string;
    };
  };
  
    // Orders Section
  orders: {
    title: string;
    subtitle: string;
    quickOrder: string;
    selectStore: string;
    searchStores: string;
    browseMenu: string;
    cart: string;
    checkout: string;
    selectDeliveryLocation: string;
    deliveryInfo: string;
    customerInfo: string;
    orderSummary: string;
    placeOrder: string;
    subtotal: string;
    deliveryFee: string;
    total: string;
    name: string;
    phone: string;
    notes: string;
    orderPlacedSuccess: string;
    noStoresFound: string;
    tryAdjusting: string;
    backToStores: string;
    customerName: string;
    customerPhone: string;
    deliveryNotes: string;
    phoneNumber: string;
    deliveryAddress: string;
    // Additional properties for OrdersSection
    back: string;
    completeOrder: string;
    selectLocationOnMap: string;
    deliveryDetails: string;
    distance: string;
    eta: string;
    nearestRobot: string;
    away: string;
    specialInstructions: string;
    specialInstructionsPlaceholder: string;
    enterName: string;
    enterPhone: string;
    additionalAddressDetails: string;
    enterAdditionalAddress: string;
    deliveryLocation: string;
    storeInformation: string;
    rating: string;
    contactStore: string;
    yourCart: string;
    add: string;
    filters: string;
    all: string;
    open: string;
    closed: string;
    mins: string;
    km: string;
    status: string;
    available: string;
    stores: {
      oceanCoffee: string;
      oceanCoffeeDesc: string;
      phoRestaurant: string;
      phoRestaurantDesc: string;
      beachStore: string;
      beachStoreDesc: string;
      // Real OCP2 Stores
      coffeelRooftop: string;
      coffeelRooftopDesc: string;
      cheHachichi: string;
      cheHachichiDesc: string;
      bipboHealthy: string;
      bipboHealthyDesc: string;
      littlePanda: string;
      littlePandaDesc: string;
      cafeMinhHy: string;
      cafeMinhHyDesc: string;
      trungNguyen: string;
      trungNguyenDesc: string;
      cafeMinh: string;
      cafeMinhDesc: string;
      anHoiAn: string;
      anHoiAnDesc: string;
      coffeeBeer79: string;
      coffeeBeer79Desc: string;
      bienHoCoffee: string;
      bienHoCoffeeDesc: string;
    };
    categories: {
      coffee: string;
      pastry: string;
      dessert: string;
      vietnameseFood: string;
      noodles: string;
      fish: string;
      convenience: string;
      drinks: string;
      food: string;
      iceCream: string;
    };
  };
  
  // Live Orders Section
  liveOrders: {
    title: string;
    subtitle: string;
    pending: string;
    inProgress: string;
    delivered: string;
    cancelled: string;
    totalRevenue: string;
    noOrdersFound: string;
    orderDetails: string;
    customerInfo: string;
    orderTracking: string;
    assignedRobot: string;
    trackRobotLive: string;
    estimatedDelivery: string;
    currentStatus: string;
    batteryLevel: string;
    speed: string;
    heading: string;
    currentLocation: string;
    destination: string;
    viewDetails: string;
    track: string;
  };
  
    // Maps Section
  maps: {
    title: string;
    subtitle: string;
    robotStatus: {
      available: string;
      delivering: string;
      charging: string;
      maintenance: string;
    };
    mapControls: {
      roadmap: string;
      satellite: string;
    };
    robotDetails: {
      battery: string;
      speed: string;
      location: string;
    };
  };
  
  // Robots Section
  robots: {
    title: string;
    subtitle: string;
    fleetSettings: string;
    addRobot: string;
    searchPlaceholder: string;
    filters: {
      all: string;
      available: string;
      delivering: string;
      charging: string;
      maintenance: string;
    };
    status: {
      available: string;
      delivering: string;
      charging: string;
      maintenance: string;
      readyForDeployment: string;
      currentlyDelivering: string;
      rechargingBattery: string;
      underRepair: string;
    };
    stats: {
      batteryLevel: string;
      location: string;
      speed: string;
      currentTask: string;
      ordersCompleted: string;
      totalDistance: string;
      lastSeen: string;
    };
    actions: {
      track: string;
      deploy: string;
      recall: string;
      control: string;
    };
    timeFormat: {
      secondsAgo: string;
      minutesAgo: string;
      hoursAgo: string;
    };
    emptyState: {
      title: string;
      description: string;
      clearFilters: string;
    };
  };
  
  // User-friendly Robots Section
  robotsUser: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    availableNow: string;
    onDelivery: string;
    offline: string;
    readyForDelivery: string;
    currentlyWorking: string;
    maintenanceCharging: string;
    availableForDelivery: string;
    battery: string;
    eta: string;
    area: string;
    orderWith: string;
    howItWorks: string;
    placeOrder: string;
    placeOrderDesc: string;
    robotPickup: string;
    robotPickupDesc: string;
    fastDelivery: string;
    fastDeliveryDesc: string;
    noRobotsFound: string;
    noRobotsDesc: string;
    clearSearch: string;
    availabilityStatus: {
      availableNow: string;
      chargingAvailableSoon: string;
      onDelivery: string;
      unavailable: string;
    };
  };
  
  // User-friendly Live Orders Section  
  liveOrdersUser: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    activeOrders: string;
    completedToday: string;
    totalSpent: string;
    recentOrders: string;
    noOrdersFound: string;
    noOrdersDesc: string;
    tryAdjusting: string;
    placeFirstOrder: string;
    selectOrder: string;
    selectOrderDesc: string;
    orderItems: string;
    deliveryProgress: string;
    yourRobot: string;
    call: string;
    chat: string;
    rateOrder: string;
    reorder: string;
    cancelOrder: string;
    allOrders: string;
    filters: {
      all: string;
      delivering: string;
      pending: string;
      completed: string;
    };
    status: {
      preparing: string;
      delivering: string;
      delivered: string;
      cancelled: string;
    };
    steps: {
      orderPlaced: string;
      restaurantConfirmed: string;
      preparingFood: string;
      robotPickup: string;
      onDelivery: string;
      delivered: string;
      inProgress: string;
      completedAt: string;
    };
  };
  
  // Footer
  footer: {
    companyName: string;
    address: string;
  };
}

// Vietnamese translations
const viTranslations: Translations = {
  nav: {
    home: 'Trang chủ',
    homeDesc: 'Giới thiệu và hướng dẫn nhanh',
    order: 'Đặt món',
    orderDesc: 'Chọn món, nhập thông tin và thanh toán',
    tracking: 'Theo dõi',
    trackingDesc: 'Xem lộ trình robot giao hàng',
    history: 'Lịch sử',
    historyDesc: 'Xem và đặt lại các đơn đã mua',
  },
  
  common: {
    systemOnline: 'Hệ thống hoạt động',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Sửa',
    view: 'Xem',
    close: 'Đóng',
    back: 'Quay lại',
    next: 'Tiếp',
    previous: 'Trước',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    refresh: 'Làm mới',
  },

  // Authentication
  auth: {
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    welcome_back: 'Chào mừng trở lại',
    login_subtitle: 'Đăng nhập vào dashboard robot giao hàng',
    register_subtitle: 'Tạo tài khoản mới để bắt đầu',
    email: 'Email',
    password: 'Mật khẩu',
    firstName: 'Tên',
    lastName: 'Họ',
    confirmPassword: 'Xác nhận mật khẩu',
    email_placeholder: 'Nhập địa chỉ email của bạn',
    password_placeholder: 'Nhập mật khẩu',
    firstName_placeholder: 'Nhập tên của bạn',
    lastName_placeholder: 'Nhập họ của bạn',
    confirmPassword_placeholder: 'Nhập lại mật khẩu',
    forgot_password: 'Quên mật khẩu?',
    remember_me: 'Ghi nhớ đăng nhập',
    logging_in: 'Đang đăng nhập...',
    registering: 'Đang tạo tài khoản...',
    no_account: 'Chưa có tài khoản?',
    have_account: 'Đã có tài khoản?',
    register_now: 'Đăng ký ngay',
    login_now: 'Đăng nhập ngay',
    reset_password: 'Đặt lại mật khẩu',
    send_reset_email: 'Gửi email đặt lại',
    back_to_login: 'Quay lại đăng nhập',
    password_requirements: 'Mật khẩu phải có ít nhất 6 ký tự',
    terms_conditions: 'Điều khoản và điều kiện',
    privacy_policy: 'Chính sách bảo mật',
    agree_terms: 'Tôi đồng ý với điều khoản và chính sách',
  },

  home: {
    welcomeMessage: 'Chào mừng đến với Alpha Asimov',
    subtitle: 'Hệ thống giao hàng robot tự động',
    welcomeBack: 'Chào mừng bạn trở lại',
    readyForDelivery: 'Sẵn sàng cho giao hàng robot nhanh chóng và đáng tin cậy?',
    
    slides: {
      whatWeDo: {
        title: 'Chúng Tôi Làm Gì',
        subtitle: 'Vận Chuyển Tương Lai',
        description: 'An toàn và thông minh - đó là robot giao hàng của chúng tôi. Với khả năng phát hiện chướng ngại vật tiên tiến và thuật toán thông minh ưu tiên người đi bộ, robot của chúng tôi di chuyển trên đường phố Việt Nam như một chuyên gia.',
        cards: {
          safeAndSmart: {
            title: 'An Toàn & Thông Minh',
            description: 'Phát hiện chướng ngại vật tiên tiến với thuật toán ưu tiên an toàn người đi bộ trong mọi hành trình.'
          },
          streetNavigation: {
            title: 'Điều Hướng Đường Phố',
            description: 'Được thiết kế chuyên nghiệp để điều hướng trên các con phố đông đúc của Việt Nam với độ chính xác cao.'
          },
          peaceOfMind: {
            title: 'Yên Tâm Tuyệt Đối',
            description: 'Dịch vụ giao hàng đáng tin cậy nơi an toàn và đổi mới kết hợp để mang lại sự yên tâm cho bạn.'
          }
        }
      },
      ourProduct: {
        title: 'Sản Phẩm Của Chúng Tôi',
        subtitle: 'Nhỏ Gọn Có Mục Đích',
        description: 'Robot của chúng tôi nhỏ gọn và linh hoạt, hoàn hảo cho việc di chuyển trên các con phố đông đúc với sự dễ dàng. Giao hàng ổn định, đáng tin cậy và thân thiện với môi trường mà bạn có thể tin tưởng.',
        cards: {
          smallOnPurpose: {
            title: 'Nhỏ Gọn Có Mục Đích',
            description: 'Thiết kế linh hoạt được thiết kế hoàn hảo cho việc điều hướng đô thị và không gian hẹp.'
          },
          consistentDelivery: {
            title: 'Yên Tâm Tuyệt Đối',
            description: 'Dịch vụ giao hàng ổn định, đáng tin cậy và luôn đúng giờ mà bạn có thể phụ thuộc vào.'
          },
          ecoFriendly: {
            title: 'Thân Thiện Môi Trường',
            description: 'Giải pháp giao hàng xanh bền vững cho tương lai môi trường tốt hơn.'
          }
        }
      },
      whoWeAre: {
        title: 'Chúng Tôi Là Ai',
        subtitle: 'Được Xây Dựng Bởi Nhân Tài Hàng Đầu',
        description: 'Chúng tôi đang đi đầu trong việc xây dựng robot giao hàng tự động thế hệ mới tại Việt Nam, với chuyên môn đẳng cấp thế giới trong AI, cơ điện tử và các giải pháp phần mềm sáng tạo.',
        cards: {
          topTalents: {
            title: 'Nhân Tài Hàng Đầu',
            description: 'Đội ngũ chuyên gia kết hợp AI, cơ điện tử, kỹ thuật phần mềm và đổi mới kinh doanh.'
          },
          passionateEngineering: {
            title: 'Kỹ Thuật Đam Mê',
            description: 'Đổi mới được thúc đẩy bởi niềm đam mê tạo ra tác động xã hội có ý nghĩa thông qua công nghệ.'
          },
          rndFocus: {
            title: 'Tập Trung R&D',
            description: 'Liên tục đẩy lùi ranh giới của giao hàng tự động và đổi mới robot học.'
          }
        }
      }
    },
    stats: {
      totalRobots: 'Tổng số Robot',
      activeDeliveries: 'Đang giao hàng',
      completedOrders: 'Đơn hoàn thành',
      uptime: 'Thời gian hoạt động',
      totalOrders: 'Tổng đơn hàng',
      activeRobots: 'Robot hoạt động',
      ordersThisMonth: 'Đơn hàng tháng này',
      totalSaved: 'Tổng tiết kiệm',
      avgDeliveryTime: 'Thời gian giao hàng TB',
      vsTradionalDelivery: 'so với giao hàng truyền thống',
      fasterThanAverage: 'nhanh hơn trung bình',
      fromLastMonth: 'so với tháng trước',
    },
    quickActions: {
      title: 'Thao Tác Nhanh',
      placeOrder: 'Đặt Hàng',
      trackDelivery: 'Theo Dõi Giao Hàng', 
      liveOrders: 'Đơn Hàng Trực Tiếp',
      newOrder: 'Đặt hàng mới',
      newOrderDesc: 'Đặt hàng nhanh chóng',
      trackRobots: 'Theo dõi Robot',
      trackRobotsDesc: 'Giám sát vị trí đội xe',
      liveOrdersDesc: 'Xem giao hàng đang hoạt động',
      orderNow: 'Đặt hàng ngay',
      orderNowDesc: 'Bắt đầu đơn hàng giao hàng mới',
      trackDeliveryDesc: 'Theo dõi đơn hàng theo thời gian thực',
      browseMap: 'Xem bản đồ',
      browseMapDesc: 'Khám phá địa điểm giao hàng',
    },
    recentActivity: 'Hoạt động gần đây',
    recentOrders: 'Đơn hàng gần đây',
    viewAllOrders: 'Xem tất cả đơn hàng',
    systemHealth: 'Tình trạng hệ thống',
    cartInProgress: 'Giỏ hàng đang chờ',
    continueOrder: 'Tiếp tục đặt hàng',
    whyChooseRobot: 'Tại sao chọn giao hàng robot?',
    fastReliable: 'Nhanh & Đáng tin cậy',
    fastReliableDesc: 'Trung bình 18 phút giao hàng',
    available24_7: 'Có sẵn 24/7',
    available24_7Desc: 'Đặt hàng mọi lúc',
    ecoFriendly: 'Thân thiện môi trường',
    ecoFriendlyDesc: 'Không phát thải',
    delivering: 'Đang giao',
    completed: 'Hoàn thành',
    pending: 'Đang chờ',
    deliveryProgress: 'Tiến độ giao hàng',
    onTheWay: 'đang trên đường',
    items: 'món',
  },

  orderFlow: {
    title: 'Đặt đơn hàng',
    subtitle: 'Chọn địa điểm bạn muốn đặt hàng để bắt đầu.',
    steps: {
      selectRestaurant: 'Chọn địa điểm',
      selectItems: 'Chọn sản phẩm',
      deliveryInfo: 'Thông tin giao hàng',
      payment: 'Thanh toán',
      complete: 'Hoàn tất đơn hàng',
    },
    restaurant: {
      title: 'Chọn địa điểm',
      subtitle: 'Chọn địa điểm bạn muốn đặt hàng để bắt đầu.',
      selectRestaurant: 'Chọn địa điểm',
      selectRestaurantDesc: 'Chọn địa điểm bạn muốn đặt hàng.',
      searchPlaceholder: 'Tìm kiếm địa điểm...',
      categories: {
        all: 'Tất cả',
        fastfood: 'Đồ ăn nhanh',
        cafe: 'Cafe & Đồ uống',
        asian: 'Món Á',
      },
      noResultsTitle: 'Không tìm thấy địa điểm nào',
      noResultsDesc: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.',
    },
    menu: {
      title: 'Chọn món từ',
      subtitle: 'Chọn các món ăn bạn muốn đặt.',
      selectItems: 'Chọn món ăn',
      selectItemsDesc: 'Chọn các món ăn bạn muốn đặt.',
      cart: 'Giỏ hàng của bạn',
      total: 'Tổng cộng',
      addToCart: 'Thêm vào giỏ',
      quantity: 'Số lượng',
      removeItem: 'Xóa món',
      noItems: 'Không có món ăn nào từ quán này.',
      noItemsDesc: 'Vui lòng chọn quán khác.',
    },
    delivery: {
      title: 'Thông tin giao hàng',
      subtitle: 'Nhập thông tin liên hệ để chúng tôi giao hàng chính xác.',
      customerName: 'Tên khách hàng',
      customerPhone: 'Số điện thoại',
      notes: 'Ghi chú thêm',
      notesPlaceholder: 'Ghi chú thêm (không bắt buộc)',
    },
    payment: {
      title: 'Phương thức thanh toán',
      subtitle: 'Chọn phương thức thanh toán bạn muốn sử dụng.',
      selectMethod: 'Chọn phương thức thanh toán',
      qrCode: 'QR Code',
      qrCodeDesc: 'Quét mã thanh toán',
      momo: 'Ví MoMo',
      momoDesc: 'Thanh toán qua ví điện tử',
      orderSummary: 'Chi tiết đơn hàng',
      deliveryFee: 'Phí giao hàng',
      free: 'Miễn phí',
      bankInfo: 'Thông tin chuyển khoản',
      bank: 'Ngân hàng',
      accountNumber: 'Số tài khoản',
      accountName: 'Chủ tài khoản',
      amount: 'Số tiền',
      momoTitle: 'Thanh toán MoMo',
      momoInstructions: 'Bấm "Mở ứng dụng MoMo" để tiếp tục thanh toán',
      momoSteps: '• Mở ứng dụng MoMo trên điện thoại\n• Xác nhận thông tin thanh toán\n• Hoàn tất giao dịch',
      processing: 'Đang xử lý...',
      waitingConfirmation: 'Đang chờ xác nhận thanh toán',
      waitingConfirmationDesc: 'Vui lòng chờ admin xác nhận đã nhận được tiền...',
      processingPayment: 'Đang xử lý thanh toán',
      processingPaymentDesc: 'Đang xử lý giao dịch MoMo của bạn...',
    },
    success: {
      title: 'Đặt hàng thành công!',
      subtitle: 'Robot sẽ nhận đơn và di chuyển tới kiosk. Bạn có thể theo dõi hành trình ngay bây giờ.',
      orderId: 'Mã đơn hàng',
      trackOrder: 'Theo dõi đơn hàng',
      placeAnother: 'Đặt thêm sản phẩm khác',
    },
    buttons: {
      back: 'Quay lại',
      next: 'Tiếp theo',
      placeOrder: 'Đặt hàng ngay',
      processing: 'Đang xử lý...',
      startUsing: 'Bắt đầu sử dụng',
    },
  },

  orders: {
    title: 'Đặt Hàng',
    subtitle: 'Chọn cửa hàng và đặt hàng với robot delivery',
    quickOrder: 'Đặt hàng nhanh',
    selectStore: 'Chọn cửa hàng',
    searchStores: 'Tìm cửa hàng...',
    browseMenu: 'Duyệt menu',
    cart: 'Giỏ hàng',
    checkout: 'Thanh toán',
    selectDeliveryLocation: 'Chọn điểm giao hàng trên bản đồ',
    deliveryInfo: 'Thông tin giao hàng',
    customerInfo: 'Thông tin khách hàng',
    orderSummary: 'Tóm tắt đơn hàng',
    placeOrder: 'Đặt hàng',
    subtotal: 'Tạm tính',
    deliveryFee: 'Phí giao hàng',
    total: 'Tổng cộng',
    name: 'Họ tên',
    phone: 'Số điện thoại',
    notes: 'Ghi chú',
    orderPlacedSuccess: 'Đặt hàng thành công!',
    noStoresFound: 'Không tìm thấy cửa hàng',
    tryAdjusting: 'Thử điều chỉnh tìm kiếm hoặc bộ lọc',
    backToStores: 'Quay lại cửa hàng',
    customerName: 'Tên khách hàng',
    customerPhone: 'Số điện thoại',
    deliveryNotes: 'Ghi chú giao hàng',
    phoneNumber: 'Số điện thoại',
    deliveryAddress: 'Địa chỉ giao hàng',
    // Additional translations for OrdersSection
    back: 'Quay lại',
    completeOrder: 'Hoàn tất đặt hàng',
    selectLocationOnMap: 'Chọn vị trí giao hàng trên bản đồ',
    deliveryDetails: 'Chi tiết giao hàng',
    distance: 'Khoảng cách',
    eta: 'Thời gian dự kiến',
    nearestRobot: 'Robot gần nhất',
    away: 'cách xa',
    specialInstructions: 'Hướng dẫn đặc biệt',
    specialInstructionsPlaceholder: 'Hướng dẫn giao hàng đặc biệt...',
    enterName: 'Nhập tên của bạn',
    enterPhone: 'Nhập số điện thoại',
    additionalAddressDetails: 'Chi tiết địa chỉ bổ sung',
    enterAdditionalAddress: 'Nhập chi tiết địa chỉ bổ sung',
    deliveryLocation: 'Vị trí giao hàng',
    storeInformation: 'Thông tin cửa hàng',
    rating: 'đánh giá',
    contactStore: 'Liên hệ cửa hàng',
    yourCart: 'Giỏ hàng của bạn',
    add: 'Thêm',
    filters: 'Bộ lọc',
    all: 'Tất cả',
    open: 'Mở cửa',
    closed: 'Đóng cửa',
    mins: 'phút',
    km: 'km',
    status: 'Trạng thái',
    available: 'sẵn sàng',
    stores: {
      oceanCoffee: 'Ocean Coffee',
      oceanCoffeeDesc: 'Cà phê và bánh ngọt tươi ngon',
      phoRestaurant: 'Nhà hàng Phở Việt',
      phoRestaurantDesc: 'Món Việt truyền thống',
      beachStore: 'Beach Convenience Store',
      beachStoreDesc: 'Đồ uống và đồ ăn vặt',
      // Real OCP2 Stores
      coffeelRooftop: 'Coffeel Cafe & Rooftop',
      coffeelRooftopDesc: 'Cà phê cao cấp với tầm nhìn rooftop tuyệt đẹp ra đại dương',
      cheHachichi: 'Chè Hachichi Grand World Little HK',
      cheHachichiDesc: 'Chè và tráng miệng Việt Nam phong cách Hong Kong',
      bipboHealthy: 'Bipbo Healthy Grand World',
      bipboHealthyDesc: 'Thức ăn tươi ngon và đồ uống hữu cơ',
      littlePanda: 'Little Panda Coffee Grand World',
      littlePandaDesc: 'Quán cà phê chủ đề gấu trúc dễ thương với bánh ngọt thủ công',
      cafeMinhHy: 'Cafe Minh Hỷ',
      cafeMinhHyDesc: 'Cà phê Việt Nam truyền thống với không gian địa phương',
      trungNguyen: 'Trung Nguyên E-Coffee',
      trungNguyenDesc: 'Chuỗi cà phê Việt Nam cao cấp với các blend đặc trưng',
      cafeMinh: 'Cafe Minh',
      cafeMinhDesc: 'Quán cà phê địa phương thân thiện với giá cả phải chăng',
      anHoiAn: 'An Hội An Cà Phê Ocean Park 2',
      anHoiAnDesc: 'Cà phê lấy cảm hứng từ Hội An với phương pháp pha truyền thống',
      coffeeBeer79: 'Coffee & Draft Beer 79',
      coffeeBeer79Desc: 'Kết hợp độc đáo giữa cà phê cao cấp và bia thủ công',
      bienHoCoffee: 'Biên Hồ Coffee',
      bienHoCoffeeDesc: 'Cà phê bên hồ với không gian yên bình tuyệt đẹp',
    },
    categories: {
      coffee: 'Cà phê',
      pastry: 'Bánh ngọt',
      dessert: 'Tráng miệng',
      vietnameseFood: 'Món Việt',
      noodles: 'Món phở',
      fish: 'Hải sản',
      convenience: 'Tiện lợi',
      drinks: 'Đồ uống',
      food: 'Thức ăn',
      iceCream: 'Kem',
    },
  },
  
  liveOrders: {
    title: 'Đơn Hàng Trực Tiếp',
    subtitle: 'Theo dõi đơn hàng real-time và trạng thái giao hàng',
    pending: 'Chờ xử lý',
    inProgress: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    totalRevenue: 'Tổng doanh thu',
    noOrdersFound: 'Không tìm thấy đơn hàng',
    orderDetails: 'Chi tiết đơn hàng',
    customerInfo: 'Thông tin khách hàng',
    orderTracking: 'Theo dõi đơn hàng',
    assignedRobot: 'Robot được giao',
    trackRobotLive: 'Theo dõi Robot trực tiếp',
    estimatedDelivery: 'Thời gian giao hàng dự kiến',
    currentStatus: 'Trạng thái hiện tại',
    batteryLevel: 'Mức pin',
    speed: 'Tốc độ',
    heading: 'Hướng đi',
    currentLocation: 'Vị trí hiện tại',
    destination: 'Điểm đến',
    viewDetails: 'Xem chi tiết',
    track: 'Theo dõi',
  },

  maps: {
    title: 'Theo Dõi Trực Tiếp',
    subtitle: 'Giám sát vị trí robot và tuyến đường real-time',
    robotStatus: {
      available: 'Sẵn sàng',
      delivering: 'Đang giao',
      charging: 'Đang sạc',
      maintenance: 'Bảo trì',
    },
    mapControls: {
      roadmap: 'Bản đồ đường',
      satellite: 'Vệ tinh',
    },
    robotDetails: {
      battery: 'Pin',
      speed: 'Tốc độ',
      location: 'Vị trí',
    },
  },
  
  robots: {
    title: 'Quản Lý Đội Robot',
    subtitle: 'Giám sát và điều khiển đội robot giao hàng',
    fleetSettings: 'Cài Đặt Đội',
    addRobot: 'Thêm Robot',
    searchPlaceholder: 'Tìm kiếm robot theo tên hoặc ID...',
    filters: {
      all: 'Tất cả',
      available: 'Sẵn sàng',
      delivering: 'Đang giao',
      charging: 'Đang sạc',
      maintenance: 'Bảo trì'
    },
    status: {
      available: 'Sẵn sàng',
      delivering: 'Đang giao',
      charging: 'Đang sạc',
      maintenance: 'Bảo trì',
      readyForDeployment: 'Sẵn sàng triển khai',
      currentlyDelivering: 'Đang giao hàng',
      rechargingBattery: 'Đang sạc pin',
      underRepair: 'Đang sửa chữa'
    },
    stats: {
      batteryLevel: 'Mức Pin',
      location: 'Vị Trí',
      speed: 'Tốc Độ',
      currentTask: 'Nhiệm Vụ Hiện Tại',
      ordersCompleted: 'Đơn Hoàn Thành',
      totalDistance: 'Tổng Quãng Đường',
      lastSeen: 'Lần Cuối Thấy'
    },
    actions: {
      track: 'Theo Dõi',
      deploy: 'Triển Khai',
      recall: 'Thu Hồi',
      control: 'Điều Khiển'
    },
    timeFormat: {
      secondsAgo: 'giây trước',
      minutesAgo: 'phút trước',
      hoursAgo: 'giờ trước'
    },
    emptyState: {
      title: 'Không tìm thấy robot',
      description: 'Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc',
      clearFilters: 'Xóa Bộ Lọc'
    }
  },
  
  robotsUser: {
    title: 'Robot Giao Hàng',
    subtitle: 'Theo dõi đội robot và tình trạng giao hàng',
    searchPlaceholder: 'Tìm robot theo tên hoặc ID...',
    availableNow: 'Sẵn sàng ngay',
    onDelivery: 'Đang giao hàng',
    offline: 'Ngoại tuyến',
    readyForDelivery: 'Sẵn sàng giao hàng',
    currentlyWorking: 'Đang làm việc',
    maintenanceCharging: 'Bảo trì/Sạc pin',
    availableForDelivery: 'Sẵn sàng giao hàng',
    battery: 'Pin',
    eta: 'Thời gian dự kiến',
    area: 'Khu vực',
    orderWith: 'Đặt hàng với',
    howItWorks: 'Cách thức hoạt động của Robot giao hàng',
    placeOrder: 'Đặt hàng',
    placeOrderDesc: 'Chọn món và địa điểm giao hàng trên bản đồ',
    robotPickup: 'Robot nhận hàng',
    robotPickupDesc: 'Robot gần nhất sẽ đến lấy đơn hàng của bạn',
    fastDelivery: 'Giao hàng nhanh',
    fastDeliveryDesc: 'Theo dõi giao hàng theo thời gian thực đến khi nhận hàng',
    noRobotsFound: 'Không tìm thấy robot',
    noRobotsDesc: 'Hiện tại không có robot nào hoạt động',
    clearSearch: 'Xóa tìm kiếm',
    availabilityStatus: {
      availableNow: 'Sẵn sàng ngay',
      chargingAvailableSoon: 'Đang sạc - Sẵn sàng sớm',
      onDelivery: 'Đang giao hàng',
      unavailable: 'Không khả dụng',
    },
  },
  
  liveOrdersUser: {
    title: 'Đơn Hàng Của Bạn',
    subtitle: 'Theo dõi giao hàng theo thời gian thực',
    searchPlaceholder: 'Tìm đơn hàng theo ID, nhà hàng hoặc địa điểm...',
    activeOrders: 'Đơn đang hoạt động',
    completedToday: 'Hoàn thành hôm nay',
    totalSpent: 'Tổng chi tiêu',
    recentOrders: 'Đơn hàng gần đây',
    noOrdersFound: 'Không tìm thấy đơn hàng',
    noOrdersDesc: 'Bạn chưa đặt đơn hàng nào',
    tryAdjusting: 'Thử điều chỉnh từ khóa tìm kiếm',
    placeFirstOrder: 'Đặt đơn hàng đầu tiên',
    selectOrder: 'Chọn đơn hàng',
    selectOrderDesc: 'Chọn đơn hàng bên trái để xem chi tiết và theo dõi',
    orderItems: 'Món đã đặt',
    deliveryProgress: 'Tiến độ giao hàng',
    yourRobot: 'Robot của bạn',
    call: 'Gọi',
    chat: 'Chat',
    rateOrder: 'Đánh giá',
    reorder: 'Đặt lại',
    cancelOrder: 'Hủy đơn',
    allOrders: 'Tất cả đơn hàng',
    filters: {
      all: 'Tất cả đơn hàng',
      delivering: 'Đang giao',
      pending: 'Đang chờ',
      completed: 'Hoàn thành',
    },
    status: {
      preparing: 'Đang chuẩn bị',
      delivering: 'Đang giao hàng',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    },
    steps: {
      orderPlaced: 'Đã đặt hàng',
      restaurantConfirmed: 'Nhà hàng xác nhận',
      preparingFood: 'Đang chuẩn bị món',
      robotPickup: 'Robot nhận hàng',
      onDelivery: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      inProgress: 'Đang thực hiện...',
      completedAt: 'Hoàn thành lúc',
    },
  },
  
  footer: {
    companyName: 'Alpha Asimov Robotics Company Limited',
    address: 'Level 3 Indochina Riverside, Hai Chau 1,\nHai Chau, Da Nang, Vietnam',
  },
};

// English translations
const enTranslations: Translations = {
  nav: {
    home: 'Home',
    homeDesc: 'Overview and quick guidance',
    order: 'Order',
    orderDesc: 'Pick items, add details, finish payment',
    tracking: 'Tracking',
    trackingDesc: 'Watch the delivery robot in real time',
    history: 'History',
    historyDesc: 'Review past orders or reorder quickly',
  },
  
  common: {
    systemOnline: 'System Online',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
  },

  // Authentication
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcome_back: 'Welcome Back',
    login_subtitle: 'Sign in to your robot delivery dashboard',
    register_subtitle: 'Create a new account to get started',
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    confirmPassword: 'Confirm Password',
    email_placeholder: 'Enter your email address',
    password_placeholder: 'Enter your password',
    firstName_placeholder: 'Enter your first name',
    lastName_placeholder: 'Enter your last name',
    confirmPassword_placeholder: 'Confirm your password',
    forgot_password: 'Forgot Password?',
    remember_me: 'Remember me',
    logging_in: 'Signing in...',
    registering: 'Creating account...',
    no_account: "Don't have an account?",
    have_account: 'Already have an account?',
    register_now: 'Sign up now',
    login_now: 'Sign in now',
    reset_password: 'Reset Password',
    send_reset_email: 'Send Reset Email',
    back_to_login: 'Back to Login',
    password_requirements: 'Password must be at least 6 characters',
    terms_conditions: 'Terms and Conditions',
    privacy_policy: 'Privacy Policy',
    agree_terms: 'I agree to the terms and privacy policy',
  },

  home: {
    welcomeMessage: 'Welcome to Alpha Asimov',
    subtitle: 'Autonomous Robot Delivery System',
    welcomeBack: 'Welcome back',
    readyForDelivery: 'Ready for fast, reliable robot delivery? Let\'s get started!',
    
    slides: {
      whatWeDo: {
        title: 'What We Do',
        subtitle: 'Delivering the Future',
        description: 'Safe and smart - that\'s our delivery robots. With advanced obstacle detection and smart algorithms that put pedestrians first, our robots navigate Vietnam\'s streets like a pro.',
        cards: {
          safeAndSmart: {
            title: 'Safe & Smart',
            description: 'Advanced obstacle detection with algorithms that prioritize pedestrian safety on every journey.'
          },
          streetNavigation: {
            title: 'Street Navigation',
            description: 'Expertly designed to navigate Vietnam\'s busy metropolitan streets with professional precision.'
          },
          peaceOfMind: {
            title: 'Peace of Mind',
            description: 'Reliable delivery service where safety and innovation go hand in hand for your peace of mind.'
          }
        }
      },
      ourProduct: {
        title: 'Our Product',
        subtitle: 'Small on Purpose',
        description: 'Our robot is small and agile, perfect for navigating busy metropolitan streets with ease. Consistent, reliable, and eco-friendly delivery that you can trust.',
        cards: {
          smallOnPurpose: {
            title: 'Small on Purpose',
            description: 'Agile design engineered perfectly for metropolitan navigation and tight spaces.'
          },
          consistentDelivery: {
            title: 'Peace of Mind',
            description: 'Consistent, reliable, and always on-time delivery service you can depend on.'
          },
          ecoFriendly: {
            title: 'Eco-friendly',
            description: 'Sustainable green delivery solutions for a better environmental future.'
          }
        }
      },
      whoWeAre: {
        title: 'Who We Are',
        subtitle: 'Built by Top Talents',
        description: 'We\'re at the forefront of building next-generation autonomous delivery robots in Vietnam, with world-class expertise in AI, mechatronics, and innovative software solutions.',
        cards: {
          topTalents: {
            title: 'Top Talents',
            description: 'Expert team combining AI, mechatronics, software engineering, and business innovation.'
          },
          passionateEngineering: {
            title: 'Passionate Engineering',
            description: 'Innovation driven by passion for creating meaningful societal impact through technology.'
          },
          rndFocus: {
            title: 'R&D Focus',
            description: 'Continuously pushing boundaries of autonomous delivery and robotics innovation.'
          }
        }
      }
    },
    stats: {
      totalRobots: 'Total Robots',
      activeDeliveries: 'Active Deliveries',
      completedOrders: 'Completed Orders',
      uptime: 'System Uptime',
      totalOrders: 'Total Orders',
      activeRobots: 'Active Robots',
      ordersThisMonth: 'Orders This Month',
      totalSaved: 'Total Saved',
      avgDeliveryTime: 'Avg Delivery Time',
      vsTradionalDelivery: 'vs traditional delivery',
      fasterThanAverage: 'faster than average',
      fromLastMonth: 'from last month',
    },
    quickActions: {
      title: 'Quick Actions',
      placeOrder: 'Place Order',
      trackDelivery: 'Track Delivery',
      liveOrders: 'Live Orders',
      newOrder: 'New Order',
      newOrderDesc: 'Place quick order',
      trackRobots: 'Track Robots',
      trackRobotsDesc: 'Monitor fleet location',
      liveOrdersDesc: 'View active deliveries',
      orderNow: 'Order Now',
      orderNowDesc: 'Start a new delivery order',
      trackDeliveryDesc: 'Follow your order in real-time',
      browseMap: 'Browse Map',
      browseMapDesc: 'Explore delivery locations',
    },
    recentActivity: 'Recent Activity',
    recentOrders: 'Recent Orders',
    viewAllOrders: 'View All Orders',
    systemHealth: 'System Health',
    cartInProgress: 'Cart in Progress',
    continueOrder: 'Continue Order',
    whyChooseRobot: 'Why Choose Robot Delivery?',
    fastReliable: 'Fast & Reliable',
    fastReliableDesc: 'Average 18min delivery',
    available24_7: '24/7 Available',
    available24_7Desc: 'Order anytime',
    ecoFriendly: 'Eco-Friendly',
    ecoFriendlyDesc: 'Zero emissions',
    delivering: 'Delivering',
    completed: 'Completed',
    pending: 'Pending',
    deliveryProgress: 'Delivery Progress',
    onTheWay: 'is on the way',
    items: 'items',
  },

  orderFlow: {
    title: 'Place Order',
    subtitle: 'Choose a location to start ordering.',
    steps: {
      selectRestaurant: 'Select Location',
      selectItems: 'Select Items',
      deliveryInfo: 'Delivery Info',
      payment: 'Payment',
      complete: 'Complete Order',
    },
    restaurant: {
      title: 'Select Location',
      subtitle: 'Choose a location to start ordering.',
      selectRestaurant: 'Select Location',
      selectRestaurantDesc: 'Choose the location you want to order from.',
      searchPlaceholder: 'Search locations...',
      categories: {
        all: 'All',
        fastfood: 'Fast Food',
        cafe: 'Cafe & Drinks',
        asian: 'Asian Food',
      },
      noResultsTitle: 'No locations found',
      noResultsDesc: 'Try changing your search keywords or filters.',
    },
    menu: {
      title: 'Select items from',
      subtitle: 'Choose the items you want to order.',
      selectItems: 'Select Items',
      selectItemsDesc: 'Choose the items you want to order.',
      cart: 'Your Cart',
      total: 'Total',
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      removeItem: 'Remove Item',
      noItems: 'No items available from this restaurant.',
      noItemsDesc: 'Please choose another restaurant.',
    },
    delivery: {
      title: 'Delivery Information',
      subtitle: 'Enter your contact information for accurate delivery.',
      customerName: 'Customer Name',
      customerPhone: 'Phone Number',
      notes: 'Additional Notes',
      notesPlaceholder: 'Additional notes (optional)',
    },
    payment: {
      title: 'Payment Method',
      subtitle: 'Choose your preferred payment method.',
      selectMethod: 'Choose payment method',
      qrCode: 'QR Code',
      qrCodeDesc: 'Scan to pay',
      momo: 'MoMo Wallet',
      momoDesc: 'Pay via e-wallet',
      orderSummary: 'Order Summary',
      deliveryFee: 'Delivery Fee',
      free: 'Free',
      bankInfo: 'Bank Transfer Information',
      bank: 'Bank',
      accountNumber: 'Account Number',
      accountName: 'Account Name',
      amount: 'Amount',
      momoTitle: 'MoMo Payment',
      momoInstructions: 'Click "Open MoMo App" to continue payment',
      momoSteps: '• Open MoMo app on your phone\n• Confirm payment information\n• Complete transaction',
      processing: 'Processing...',
      waitingConfirmation: 'Waiting for payment confirmation',
      waitingConfirmationDesc: 'Please wait for admin to confirm payment received...',
      processingPayment: 'Processing payment',
      processingPaymentDesc: 'Processing your MoMo transaction...',
    },
    success: {
      title: 'Order placed successfully!',
      subtitle: 'The robot will pick up your order and head to the kiosk. You can track the journey now.',
      orderId: 'Order ID',
      trackOrder: 'Track Order',
      placeAnother: 'Place Another Order',
    },
    buttons: {
      back: 'Back',
      next: 'Next',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      startUsing: 'Start Using',
    },
  },

  orders: {
    title: 'Place Order',
    subtitle: 'Choose stores and place orders with robot delivery',
    quickOrder: 'Quick Order',
    selectStore: 'Select Store',
    searchStores: 'Search stores...',
    browseMenu: 'Browse Menu',
    cart: 'Cart',
    checkout: 'Checkout',
    selectDeliveryLocation: 'Select Delivery Location on Map',
    deliveryInfo: 'Delivery Info',
    customerInfo: 'Customer Info',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    name: 'Name',
    phone: 'Phone',
    notes: 'Notes',
    orderPlacedSuccess: 'Order placed successfully!',
    noStoresFound: 'No stores found',
    tryAdjusting: 'Try adjusting your search or filters',
    backToStores: 'Back to Stores',
    customerName: 'Customer Name',
    customerPhone: 'Phone Number',
    deliveryNotes: 'Delivery Notes',
    phoneNumber: 'Phone Number',
    deliveryAddress: 'Delivery Address',
    // Additional translations for OrdersSection
    back: 'Back',
    completeOrder: 'Complete Order',
    selectLocationOnMap: 'Select Delivery Location on Map',
    deliveryDetails: 'Delivery Details',
    distance: 'Distance',
    eta: 'ETA',
    nearestRobot: 'Nearest Robot',
    away: 'away',
    specialInstructions: 'Special Instructions',
    specialInstructionsPlaceholder: 'Any special delivery instructions...',
    enterName: 'Enter your name',
    enterPhone: 'Enter your phone',
    additionalAddressDetails: 'Additional Address Details',
    enterAdditionalAddress: 'Enter additional address details',
    deliveryLocation: 'Delivery Location',
    storeInformation: 'Store Information',
    rating: 'rating',
    contactStore: 'Contact Store',
    yourCart: 'Your Cart',
    add: 'Add',
    filters: 'Filters',
    all: 'All',
    open: 'Open',
    closed: 'Closed',
    mins: 'mins',
    km: 'km',
    status: 'Status',
    available: 'available',
    stores: {
      oceanCoffee: 'Ocean Coffee',
      oceanCoffeeDesc: 'Fresh coffee and pastries',
      phoRestaurant: 'Vietnamese Pho Restaurant',
      phoRestaurantDesc: 'Traditional Vietnamese cuisine',
      beachStore: 'Beach Convenience Store',
      beachStoreDesc: 'Drinks and snacks',
      // Real OCP2 Stores
      coffeelRooftop: 'Coffeel Cafe & Rooftop',
      coffeelRooftopDesc: 'Premium coffee with stunning rooftop ocean view',
      cheHachichi: 'Chè Hachichi Grand World Little HK',
      cheHachichiDesc: 'Authentic Vietnamese sweet soup & desserts Hong Kong style',
      bipboHealthy: 'Bipbo Healthy Grand World',
      bipboHealthyDesc: 'Fresh healthy meals and organic beverages',
      littlePanda: 'Little Panda Coffee Grand World',
      littlePandaDesc: 'Cute panda-themed coffee shop with artisan pastries',
      cafeMinhHy: 'Cafe Minh Hỷ',
      cafeMinhHyDesc: 'Traditional Vietnamese coffee with local atmosphere',
      trungNguyen: 'Trung Nguyên E-Coffee',
      trungNguyenDesc: 'Premium Vietnamese coffee chain with signature blends',
      cafeMinh: 'Cafe Minh',
      cafeMinhDesc: 'Friendly local coffee spot with affordable prices',
      anHoiAn: 'An Hội An Cà Phê Ocean Park 2',
      anHoiAnDesc: 'Hoi An inspired coffee with traditional brewing methods',
      coffeeBeer79: 'Coffee & Draft Beer 79',
      coffeeBeer79Desc: 'Unique combo of premium coffee and craft beer',
      bienHoCoffee: 'Biên Hồ Coffee',
      bienHoCoffeeDesc: 'Scenic lakeside coffee with peaceful atmosphere',
    },
    categories: {
      coffee: 'Coffee',
      pastry: 'Pastries',
      dessert: 'Desserts',
      vietnameseFood: 'Vietnamese Food',
      noodles: 'Noodles',
      fish: 'Seafood',
      convenience: 'Convenience',
      drinks: 'Drinks',
      food: 'Food',
      iceCream: 'Ice Cream',
    },
  },
  
  liveOrders: {
    title: 'Live Orders',
    subtitle: 'Track orders and delivery status in real-time',
    pending: 'Pending',
    inProgress: 'In Progress',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    totalRevenue: 'Total Revenue',
    noOrdersFound: 'No orders found',
    orderDetails: 'Order Details',
    customerInfo: 'Customer Information',
    orderTracking: 'Order Tracking',
    assignedRobot: 'Assigned Robot',
    trackRobotLive: 'Track Robot Live',
    estimatedDelivery: 'Estimated Delivery',
    currentStatus: 'Current Status',
    batteryLevel: 'Battery Level',
    speed: 'Speed',
    heading: 'Heading',
    currentLocation: 'Current Location',
    destination: 'Destination',
    viewDetails: 'View Details',
    track: 'Track',
  },

  maps: {
    title: 'Live Tracking',
    subtitle: 'Monitor robot locations and routes in real-time',
    robotStatus: {
      available: 'Available',
      delivering: 'Delivering',
      charging: 'Charging',
      maintenance: 'Maintenance',
    },
    mapControls: {
      roadmap: 'Roadmap',
      satellite: 'Satellite',
    },
    robotDetails: {
      battery: 'Battery',
      speed: 'Speed',
      location: 'Location',
    },
  },
  
  robots: {
    title: 'Robot Fleet Management',
    subtitle: 'Monitor and control your delivery robot fleet',
    fleetSettings: 'Fleet Settings',
    addRobot: 'Add Robot',
    searchPlaceholder: 'Search robots by name or ID...',
    filters: {
      all: 'All',
      available: 'Available',
      delivering: 'Delivering',
      charging: 'Charging',
      maintenance: 'Maintenance'
    },
    status: {
      available: 'Available',
      delivering: 'Delivering',
      charging: 'Charging',
      maintenance: 'Maintenance',
      readyForDeployment: 'Ready for deployment',
      currentlyDelivering: 'Currently delivering',
      rechargingBattery: 'Recharging battery',
      underRepair: 'Under repair'
    },
    stats: {
      batteryLevel: 'Battery Level',
      location: 'Location',
      speed: 'Speed',
      currentTask: 'Current Task',
      ordersCompleted: 'Orders Completed',
      totalDistance: 'Total Distance',
      lastSeen: 'Last Seen'
    },
    actions: {
      track: 'Track',
      deploy: 'Deploy',
      recall: 'Recall',
      control: 'Control'
    },
    timeFormat: {
      secondsAgo: 's ago',
      minutesAgo: 'm ago',
      hoursAgo: 'h ago'
    },
    emptyState: {
      title: 'No robots found',
      description: 'Try adjusting your search or filter criteria',
      clearFilters: 'Clear Filters'
    }
  },

  robotsUser: {
    title: 'Robot Fleet',
    subtitle: 'Available delivery robots near you',
    searchPlaceholder: 'Search robots...',
    availableNow: 'Available Now',
    onDelivery: 'On Delivery',
    offline: 'Offline',
    readyForDelivery: 'Ready for delivery',
    currentlyWorking: 'Currently working',
    maintenanceCharging: 'Maintenance/Charging',
    availableForDelivery: 'Available for delivery',
    battery: 'Battery',
    eta: 'ETA',
    area: 'Area',
    orderWith: 'Order with',
    howItWorks: 'How it works',
    placeOrder: 'Place Order',
    placeOrderDesc: 'Choose items and location',
    robotPickup: 'Robot Pickup',
    robotPickupDesc: 'Robot collects your order',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Delivered to your location',
    noRobotsFound: 'No robots found',
    noRobotsDesc: 'Try adjusting search or location',
    clearSearch: 'Clear Search',
    availabilityStatus: {
      availableNow: 'Available Now',
      chargingAvailableSoon: 'Charging - Available Soon',
      onDelivery: 'On Delivery',
      unavailable: 'Unavailable'
    }
  },

  liveOrdersUser: {
    title: 'Live Orders',
    subtitle: 'Track your orders in real-time',
    searchPlaceholder: 'Search orders...',
    activeOrders: 'Active Orders',
    completedToday: 'Completed Today',
    totalSpent: 'Total Spent',
    recentOrders: 'Recent Orders',
    noOrdersFound: 'No orders found',
    noOrdersDesc: 'You don\'t have any orders yet',
    tryAdjusting: 'Try adjusting your search',
    placeFirstOrder: 'Place Your First Order',
    selectOrder: 'Select Order',
    selectOrderDesc: 'Choose an order to track',
    orderItems: 'Order Items',
    deliveryProgress: 'Delivery Progress',
    yourRobot: 'Your Robot',
    call: 'Call',
    chat: 'Chat',
    rateOrder: 'Rate Order',
    reorder: 'Reorder',
    cancelOrder: 'Cancel Order',
    allOrders: 'All Orders',
    filters: {
      all: 'All Orders',
      delivering: 'Delivering',
      pending: 'Pending',
      completed: 'Completed'
    },
    status: {
      preparing: 'Preparing',
      delivering: 'Delivering',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    steps: {
      orderPlaced: 'Order Placed',
      restaurantConfirmed: 'Restaurant Confirmed',
      preparingFood: 'Preparing Food',
      robotPickup: 'Robot Pickup',
      onDelivery: 'On Delivery',
      delivered: 'Delivered',
      inProgress: 'In Progress',
      completedAt: 'Completed at'
    }
  },
  
  footer: {
    companyName: 'Alpha Asimov Robotics Company Limited',
    address: 'Level 3 Indochina Riverside, Hai Chau 1,\nHai Chau, Da Nang, Vietnam',
  },
};

// Language context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = language === 'vi' ? viTranslations : enTranslations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
