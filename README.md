# API Error Response Formatter

Sends formatted error responses for API's.  The format is as follows:

```javascript
{
	errors: [{
		message: 'A human readable error message',
		code: 'A_MACHINE_PARSABLE_ERROR_CODE',
		level: 'error'
	}]
}
```

All api errors will follow this format.  The `message` is intended for display to the user, it will change and should not be programmed against.  The `code` is for logging and programitic parsing, it should not be displayed to the user and should be unique across the whole application.  The `level` is for specifying different error levels.  Possiable levels are `error`, `warning`, `message`.

# Usage

```javascript
var errors = require('api-errors');

var app = require('express')();
app.use(function(req, res, next) {
	// Do something that can error
	somethingThatErrors(function(err) {
		if (err) {
			// Return error
			errors.e500(res, {
				message: 'Error inserting user',
				code: 'user-insert-error',
			});
			return;
		}
		next();
	});
});
```

## Methods

There are only two methods for now, but we will add more for the standard error codes and messages we send.

#### `format(err[, defaults])`

Formats the given error into an array of the proper format.  Err must be an object or an array of objects that can be formatted into the above format.

#### `e500(res, err[, defaults])`

Sends a 500 level error.  Err can be an instance of an error or an object that implements `message` and `code`.  Defaults is used to set fallback messages if the error object is dynamic and does not implement both message and code.
