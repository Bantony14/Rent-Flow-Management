function otpGenerator() {
    let otpGenerator = Math.floor(1000 + Math.random() * 9000);
    return otpGenerator;
}

export default otpGenerator;