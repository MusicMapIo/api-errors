var logger = require('logtastic');

// The exported namspace
var errors = module.exports;

// Formats a single error object
errors._formatter = function(err, defaults) {
	err = err || {};
	defaults = defaults || {};

	return {
		message: err.message || defaults.message || 'An unknown error occured.',
		code: err.code || defaults.code || 'generic_error',
		level: err.level || defaults.level || 'error'
	};
};

// Formats a the error, always returns an array of error objects
errors.format = function(err, defaults) {
	// If it is an array of errors, format them all
	if (err instanceof Array) {
		return err.map(function(e) {
			return errors._formatter(e, defaults);
		});
	}

	// If it is an instance of error or a plain object, format it as an array
	if (typeof err === 'object') {
		return [errors._formatter(err, defaults)];
	}

	// If it is anything else log a warning because we shouldn'd be doing that
	logger.warning('Invalid error message', err);
	logger.debug([
		'The api-error module should only be passed errors or an',
		'array of errors.  You passed  a/an ' + (typeof err) + ' which does not pass',
		'`instanceof Array` or `typeof err === \'object\' && err.message && err.code`.'
	].join(' '), err);

};

[400, 404, 500].forEach(function(status) {
	errors['e' + status] = function(res, err, defaults) {
		logger.info(status + 'error response', err, defaults);
		res.status(status).json({
			errors: errors.format(err, defaults)
		});
	};
});
