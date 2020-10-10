const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path);
};
const validateName = (rule, value, callback) => {
  if (!value.trim().length) {
    callback(new Error("请输入商家名称"));
  } else {
    callback();
  }
};
const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};

const validateLinkName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
const validateTelephone = (rule, value, callback) => {
  const phoneRe = new RegExp(/^1\d{10}$/);
  if (!phoneRe.test(value)) {
    callback(new Error("请正确输入11位手机号码"));
  } else {
    callback();
  }
};
const validateVerfication = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入图形验证码"));
  } else {
    const regExp = new RegExp(/^\w{4}$/);
    if (!regExp.test(value)) {
      callback(new Error("请输入4位图形验证码"));
    } else {
      callback();
    }
  }
};
const validateSmsCode = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入短信验证码"));
  } else {
    const regExp = new RegExp(/^\d{6}$/);
    if (!regExp.test(value)) {
      callback(new Error("请输入6位短信验证码"));
    } else {
      callback();
    }
  }
};
const validateLicenseCode = (rule, value, callback) => {
  if (!value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
const validateLicenseUrl = (rule, value, callback) => {
  if (!value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
const validateCorporate = (rule, value, callback) => {
  if (!value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
const validateCorporateIdCard = (rule, value, callback) => {
  if (!value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
const validateAddress = (rule, value, callback) => {
  if (!value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
export {
  isExternal,
  validateName,
  validateLinkName,
  validateTelephone,
  validateVerfication,
  validateSmsCode,
  validateLicenseCode,
  validateLicenseUrl,
  validateCorporate,
  validateCorporateIdCard,
  validateAddress,
  validatePassword
};
