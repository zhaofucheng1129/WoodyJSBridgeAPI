// 初始化JSBridge
function connectWebViewJavascriptBridge(cb) { 
  if (window.WebViewJavascriptBridge && WebViewJavascriptBridge.inited) { 
    cb(WebViewJavascriptBridge); 
  } else { 
    var WVJBIframe = document.createElement('iframe'); 
    WVJBIframe.style.display = 'none'; 
    WVJBIframe.src = 'woody://__bridge_loaded__'; 
    document.documentElement.appendChild(WVJBIframe); 
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0) 

    document.addEventListener( 
      "WebViewJavascriptBridgeReady", 
      () => cb(WebViewJavascriptBridge), 
      false 
    ); 
  } 
} 

// 连接桥接
connectWebViewJavascriptBridge((bridge) => { 
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
  WebViewJavascriptBridge.callHandler(
    "scanQRCode",
    {},
    function (response) {
      if (response.success) {
        options.success && options.success(response);
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
        "结果：" + res.result;
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
    latitude: 31.2396,
    longitude: 121.4952,
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
  WebViewJavascriptBridge.callHandler(
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
  WebViewJavascriptBridge.callHandler(
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
        options.success && options.success(response);
      } else {
        options.fail && options.fail(response);
      }
      options.complete && options.complete(response);
    }
  );
}