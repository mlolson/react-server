var Q = require("q");

var PromiseUtil = module.exports = {
	/** 
	 * Translates a normal Promise to a simple EarlyPromise. 
	 *     promise (required): the promise to translate.
	 *     pendingValue (optional): the value to be returned by get while the promise is pending.
	 *         defaults to null if not present.
	 */
	early(promise, pendingValue) {
		// if it's already an EarlyPromise, just return it.
		if (promise && promise.getValue) {
			return promise;
		}

		var value = (pendingValue !== undefined) ? pendingValue : null, 
			error = null;

		promise.then((resolvedValue) => {
			value = resolvedValue;
			return value;
		}).catch((resolvedError) => {
			error = resolvedError;
		})

		promise.getValue = function() { 
			if (null !== error) throw error;
			return value;
		};
		return promise;
	},

	/**
	 * Return the value of the first resolved or rejected promise in the arguments array
	 */
	race(...promises) {
		var resultDeferred = Q.defer();

		promises.forEach((promise) => {
			promise.then(
				(value) => resultDeferred.resolve(value),
				(error) => resultDeferred.reject(error));
		});

		return resultDeferred.promise;
	}
}