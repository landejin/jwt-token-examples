var express = require("express");
var router = express.Router();

// 模拟用户信息
const user = {
  name: "zs",
  refresh_token: "",
  isDisabled: false // 用户权限
};

const expires = 10 * 1000; // access_token过期时间，10秒

/* 服务测试首页 */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// 模拟登录获取token
router.post("/login", function (req, res, next) {
  user.refresh_token = Date.now() + 5 * 60 * 1000; // 5分钟到期

  res.send({
    code: 200,
    msg: "请求成功",
    data: {
      access_token: Date.now() + expires,
      ...user,
    },
  });
});

// 刷新token
router.post("/refresh", function (req, res, next) {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.send({
      code: 401,
      msg: "refresh_token不存在",
    });
  }

  // 校验refresh_token是否正确、或者判断用户权限isDisabled
  if (refresh_token.toString() !== user.refresh_token.toString()) {
    return res.send({
      code: 401,
      msg: "refresh_token失效",
    });
  }

  // 校验token是否已经过期
  if (parseInt(refresh_token) < Date.now()) {
    return res.send({
      code: 401,
      msg: "refresh_token过期，请重新登录",
    });
  }

  setTimeout(() => {
    res.send({
      code: 200,
      msg: "请求成功",
      data: {
        access_token: Date.now() + expires, // 一分钟到期
      },
    });
  }, 5000);
});

function checkToken(token) {
  if (user.isDisabled || !token || parseInt(token) < Date.now()) {
    // 用户权限被回收或者 token过期
    return false;
  }

  return true;
}

// 检查token
router.post("/list", function (req, res, next) {
  if (!checkToken(req.get("access-token"))) {
    return res.send({
      code: 402,
      msg: "token过期，请刷新token",
    });
  }

  res.send({
    code: 200,
    msg: "请求成功",
  });
});

router.post("/detail", function (req, res, next) {
  if (!checkToken(req.get("access-token"))) {
    return res.send({
      code: 402,
      msg: "token过期，请刷新token",
    });
  }

  res.send({
    code: 200,
    msg: "请求成功",
  });
});

// 退出用户
router.post("/cancel", function (req, res, next) {
  user.isDisabled = true
  user.refresh_token = ''
  res.send({
    code: 200,
    msg: '请求成功'
  })
});

module.exports = router;
