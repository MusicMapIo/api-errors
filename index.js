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

// Send a 500 error
errors.e500 = function(res, err, defaults) {
	logger.info('500 error response', err, defaults);
	res.status(500).json({
		errors: errors.format(err, defaults)
	});
};

// Send a 400 error
errors.e400 = function(res, err, defaults) {
	logger.info('400 error response', err, defaults);
	res.status(400).json({
		errors: errors.format(err, defaults)
	});
};
