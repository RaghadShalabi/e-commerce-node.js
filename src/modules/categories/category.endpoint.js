const roles = {
    Admin: 'Admin',
    User: 'User'
}

export const endPoint = {
    create: [roles.Admin],
    getAll: [roles.Admin],
    getActive: [roles.User],
    update: [roles.Admin],
    specific: [roles.Admin, roles.User]
}