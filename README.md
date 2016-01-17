# Can I?

> Authorization service for a Microservices Architecture

Authorization is used in systems to determine who has access on which resources. A system may implement a Role Based Access Control or an Access Control List to define domain specific resources, roles and permissions between them. 

Can I? is an independent service, that provides a REST API (JSON) to define and manage a RBAC system. It can be used in conjunction with the rest of your infrastructure.

The concept is to ask the Authorization service, every time you need to know if the logged in user has access to a resource. You can use it with a REST API, to give access to certain endpoints and/or in a UI, to determine which actions to show to the logged in user.
 
Furthermore, you can build your own UI to handle the management of your Authorization service, so non tech people can manage them. 

## Tools & Frameworks

* Nodejs 4 
* Express.js
* MongoDB

## How To
Clone the repo and hit those commands to run the service. Ensure that your MongoDB is up and running:

```bash
$ npm i
$ npm start
```

To run the tests:

```bash
$ npm test
```

## Terminology

* Roles: Roles are used to define groups of users that can access certain resources. Examples: User, Admin, Manager
* Resources: Resources are used to describe areas of your system to allow/disallow access to. Examples: access_admin, manage_users, create_users, edit_users
* Permissions: Permissions are connections between Roles and Resources to determine who has access to what.

## API

### Roles

```bash
GET /roles
```
Get all Roles.

```bash
GET /roles/:roleId
```
Get a specific Role.

```bash
POST /roles
```
Create a new Role by providing an `_id` and a `name`.

```bash
PUT /roles/:roleId
```
Update Role's `name`. `_id` can't be change. 

```bash
DELETE /roles/:roleId
```
Delete Role.

### Resources

```bash
GET /resources
```
Get all Resources.

```bash
GET /resources/:resourceId
```
Get a specific Resource.

```bash
POST /resources
```
Create a new Resource by providing an `_id` and a `name`.

```bash
PUT /resources/:resourceId
```
Update Resource's `name`. `_id` can't be change.

```bash
DELETE /resources/:resourceId
```
Delete Resource.

### Permissions

```bash
GET /permissions/:roleId/:resourceId
```
Check if Role has access to Resource.

```bash
GET /permissions/:roleId
```
Get all Resources the give Role has access to.

```bash
POST /permissions/:roleId/:resourceId
```
Allow Role to have access to Resource.

```bash
POST /permissions/:roleId
```
Allow Role to have access to Resources, be providing an array of Resource IDs to body.

```bash
DELETE /permissions/:roleId/:resourceId
```
Disallow Role to have access to Resource.

```bash
DELETE /permissions/
```
Disallow Role to have access to Resources, be providing an array of Resource IDs to body.