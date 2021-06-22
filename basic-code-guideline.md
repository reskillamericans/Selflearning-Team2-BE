# Code guideline to follow

- Error response should be

```
return res.status(404).json({
    status: 'fail',
    errorMessage: `Page not found. Can't find ${req.originalUrl} on this server`
  })

```

- Success response should be

```
res.status(200).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user
    }
  })

```

## Response Code

1. 200 - OK
2. 201 - Created
3. 204 - No Content
4. 400 - Bad Request
5. 401 - Unauthorized
6. 402 - Payment Required
7. 403 - Forbidden
8. 404 - Not Found
9. 500 - Internal Server Error
10. 502 - Bad Gateway

## HTTP verbs that will be used

1. GET: To retrive resources
2. POST: TO create resources
3. PATCH: To Update resources
4. DELETE: To delete resources

## URL

- eg. /api/v1/users
