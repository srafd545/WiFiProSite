interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  en: {
    title: "WiFi Connection",
    subtitle: "Connect to secure WiFi network",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    connect: "Connect",
    register: "Register",
    createAccount: "Create Account",
    forgotPassword: "Forgot Password?",
    backToLogin: "Back to Login",
    sendRecoveryCode: "Send Recovery Code",
    verifyCode: "Verify Code",
    recoveryCode: "Recovery Code",
    updatePassword: "Update Password",
    connectedTitle: "Connected to WiFi",
    connectedSubtitle: "You're now connected to the network",
    disconnect: "Disconnect",
    networkName: "Network Name",
    speed: "Speed",
    signal: "Signal",
    ipAddress: "IP Address",
    macAddress: "MAC Address"
  },
  ru: {
    title: "WiFi Подключение",
    subtitle: "Подключение к защищенной сети WiFi",
    email: "Электронная почта",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    connect: "Подключиться",
    register: "Зарегистрироваться",
    createAccount: "Создать аккаунт",
    forgotPassword: "Забыли пароль?",
    backToLogin: "Вернуться к входу",
    sendRecoveryCode: "Отправить код восстановления",
    verifyCode: "Проверить код",
    recoveryCode: "Код восстановления",
    updatePassword: "Обновить пароль",
    connectedTitle: "Подключено к WiFi",
    connectedSubtitle: "Вы подключены к сети",
    disconnect: "Отключиться",
    networkName: "Имя сети",
    speed: "Скорость",
    signal: "Сигнал",
    ipAddress: "IP адрес",
    macAddress: "MAC адрес"
  }
};