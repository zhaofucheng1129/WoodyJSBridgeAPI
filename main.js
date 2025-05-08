// 初始化JSBridge
function connectWoodyBridge(cb) { 
  if (window.WoodyBridge && WoodyBridge.inited) { 
    cb(WoodyBridge); 
  } else { 
    var WVJBIframe = document.createElement('iframe'); 
    WVJBIframe.style.display = 'none'; 
    WVJBIframe.src = 'woody://__bridge_loaded__'; 
    document.documentElement.appendChild(WVJBIframe); 
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0) 

    document.addEventListener( 
      "WoodyBridgeReady", 
      () => cb(WoodyBridge), 
      false 
    ); 
  } 
} 

// 连接桥接
connectWoodyBridge((bridge) => { 
  bridge.init((msg, respCb) => 
    // 可选的回调函数
    respCb?.({ "Javascript Responds": "测试中文!" }) 
  ); 
  // registerHandler是可选的，只有需要接收原生端调用时才需要
  // bridge.registerHandler("functionInJs", (data, respCb) => 
  //   respCb?.("Javascript Says Right back aka!") 
  // ); 
});

// 扫码功能
function _wdScanQRCode(options) {
  WoodyBridge.callHandler(
    "scanQRCode",
    {},
    function (response) {
      if (response.success) {
        options.success && options.success(response.result);
      } else {
        options.fail && options.fail(response);
      }
      options.complete && options.complete(response);
    }
  );
}

// 测试扫一扫
function testScanQRCode() {
  _wdScanQRCode({
    success: function (res) {
      document.getElementById("scanResult").innerText = 
        "扫码成功：\n" + 
        "结果：" + res;
    },
    fail: function (res) {
      document.getElementById("scanResult").innerText = 
        "扫码失败：\n" + 
        "错误信息：" + res.errMsg + "\n" +
        "错误码：" + res.errCode;
    },
    complete: function (res) {
      console.log("扫码操作完成", res);
    }
  });
}

// 测试获取位置
function testLocation() {
  _wdGetLocation({
    success: function(res) {
      document.getElementById("locationResult").innerText = 
        "位置信息：\n" +
        "纬度：" + res.latitude + "\n" +
        "经度：" + res.longitude + "\n" +
        "位置名：" + (res.name || "未知") + "\n" +
        "详细地址：" + (res.address || "未知");
    },
    fail: function(res) {
      document.getElementById("locationResult").innerText = 
        "获取位置失败：\n" +
        "错误信息：" + res.errMsg;
    },
    complete: function(res) {
      console.log("位置获取操作完成", res);
    }
  });
}

// 测试导航
function testNavigation() {
  _wdNavigationTo({
    // GCJ02坐标系 - 人民广场
    startLatitude: 31.2304,
    startLongitude: 121.4737,
    startName: "人民广场",
    // GCJ02坐标系 - 东方明珠
    latitude: 31.239654,
    longitude: 121.499674,
    destinationName: "东方明珠",
    success: function(res) {
      document.getElementById("navigationResult").innerText = 
        "导航启动成功\n" +
        "目的地：东方明珠";
    },
    fail: function(res) {
      document.getElementById("navigationResult").innerText = 
        "导航启动失败：\n" +
        "错误码：" + res.errCode + "\n" +
        "错误信息：" + res.errMsg;
    },
    complete: function(res) {
      console.log("导航操作完成", res);
    }
  });
}

// 导航相关功能
function toggleNav() {
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.overlay');
  nav.classList.toggle('active');
  overlay.classList.toggle('active');
}

// 移动端导航链接点击处理
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.overlay');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    });
  });
});

// 获取位置功能
function _wdGetLocation(options) {
  WoodyBridge.callHandler(
    "getLocation",
    {},
    function(response) {
      if (response.success) {
        options.success && options.success(response.result);
      } else {
        options.fail && options.fail(response);
      }
      options.complete && options.complete(response);
    }
  );
}

// 导航功能
function _wdNavigationTo(options) {
  WoodyBridge.callHandler(
    "navigationTo",
    {
      startLatitude: options.startLatitude,
      startLongitude: options.startLongitude,
      startName: options.startName,
      latitude: options.latitude,
      longitude: options.longitude,
      destinationName: options.destinationName
    },
    function(response) {
      if (response.success) {
        options.success && options.success();
      } else {
        options.fail && options.fail(response);
      }
      options.complete && options.complete(response);
    }
  );
}

// 设置导航栏功能
function _wdSetNavigationBar(options) {
  WoodyBridge.callHandler(
    "setNavigationBar",
    {
      hidden: options.hidden
    },
    function(response) {
      if (response.success) {
        options.success && options.success();
      } else {
        options.fail && options.fail(response);
      }
      options.complete && options.complete(response);
    }
  );
}

let isHidden = false;
// 测试设置导航栏
function testSetNavigationBar() {
  isHidden = !isHidden
  _wdSetNavigationBar({
    hidden: isHidden,
    success: function() {
      document.getElementById("navigationBarResult").innerText = 
        isHidden ? "导航栏已隐藏" : "导航栏已显示"
    },
    fail: function(res) {
      document.getElementById("navigationBarResult").innerText = 
        "设置导航栏失败：\n" +
        "错误信息：" + res.errMsg;
    },
    complete: function(res) {
      console.log("导航栏设置操作完成", res);
    }
  });
}

// 关闭窗口功能
function _wdCloseWindow(options) {
  WoodyBridge.callHandler(
    "closeWindow",
    {},
    function(response) {
      if (response.success) {
        options.success && options.success();
      } else {
        options.fail && options.fail(response);
      }
      options.complete && options.complete(response);
    }
  );
}

// 测试关闭窗口
function testCloseWindow() {
  _wdCloseWindow({
    success: function() {
      document.getElementById("closeWindowResult").innerText = 
        "窗口关闭成功";
    },
    fail: function(res) {
      document.getElementById("closeWindowResult").innerText = 
        "窗口关闭失败：\n" +
        "错误信息：" + res.errMsg;
    },
    complete: function(res) {
      document.getElementById("closeWindowResult").innerText += "\n操作完成";
      console.log("窗口关闭操作完成", res);
    }
  });
}

// 获取系统状态栏和底部导航条高度功能
function _wdGetSystemBarHeight(options) {
  WoodyBridge.callHandler(
    "getSystemBarHeight",
    {},
    function(response) {
      if (response.success) {
        options.success && options.success(response.result);
      } else {
        options.fail && options.fail(response);
      }
      options.complete && options.complete(response);
    }
  );
}

// 测试获取系统状态栏和底部导航条高度
function testGetSystemBarHeight() {
  _wdGetSystemBarHeight({
    success: function(res) {
      document.getElementById("barHeightResult").innerText = 
        "系统状态栏和底部导航条高度信息：\n" +
        "状态栏高度：" + res.statusBarHeight + "px\n" +
        "底部导航条高度：" + res.systemNavBarHeight + "px";
    },
    fail: function(res) {
      document.getElementById("barHeightResult").innerText = 
        "获取高度失败：\n" +
        "错误信息：" + res.errMsg;
    },
    complete: function(res) {
      console.log("获取高度操作完成", res);
    }
  });
}