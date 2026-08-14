export const errorMsg = {
    fullName: "Name must be at least 3 characters",
    aadhaarNumber: "Aadhaar number must be 12 digits",
    mobileNumber: "Mobile number must be 10 digits",
    dob: "Please select your date of birth",
    password: "8+ chars, uppercase, lowercase, number & special char (@$!%*?&) required",
    roomNumber: "First select building to see all roomNumber",
    building: "Please select a building",
    email: "Please enter a valid email address",
};
export const validation = (formData, strongPassword, strongEmail) => {
    return {
        fullName: formData.fullName.length < 3,
        aadhaarNumber: !/^\d{12}$/.test(formData.aadhaarNumber),
        mobileNumber: !/^\d{10}$/.test(formData.mobileNumber),
        password:
            !strongPassword.test(formData.password),
        email:
            !strongEmail.test(formData.email),
        roomNumber: formData.building === "",
    }
};

export const rooms = {
    "Krishna Tower": [
        "B-101", "B-102", "B-103", "B-104", "B-105"
    ],
    "Shivam Residency": [
        "A-101", "A-102", "A-103", "A-104", "A-105"
    ]
};

export const input = (roomOptions, buildingOption) => {
    const value = [
        {
            type: "text",
            name: "fullName",
            placeholder: "Enter your Tenant full name",
            minLength: 3,
            maxLength: 30
        },
        {
            type: "text",
            name: "aadhaarNumber",
            placeholder: "Enter 12-digit Aadhaar number",
            minLength: 12,
            maxLength: 12
        },
        {
            type: "text",
            name: "mobileNumber",
            placeholder: "Enter mobile number",
            minLength: 10,
            maxLength: 10
        },
        {
            type: "date",
            name: "dob",
            placeholder: "Select date of birth"
        },

        {
            type: "password",
            name: "password",
            placeholder: "Create a strong password",
            minLength: 8,
            maxLength: 20
        },
        {
            type: "select",
            name: "building",
            options: buildingOption || [],
        },
        {
            type: "select",
            name: "roomNumber",
            minLength: 1,
            maxLength: 5,
            options: roomOptions || [],
        },
        {
            type: "text",
            name: "rentPrice",
            placeholder: "Enter rent",
        },
        {
            type: "date",
            name: "joiningDate",
            placeholder: "Select date of joining"
        },
        {
            type: "email",
            name: "email",
            placeholder: "Enter your email address",
            minLength: 5,
            maxLength: 50
        },
    ]

    return value;
};