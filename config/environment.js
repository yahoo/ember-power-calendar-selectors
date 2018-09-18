'use strict';

module.exports = function(/* environment, appConfig */) {
  return { 
    'ember-prop-types': {
      // When true components will throw an error if they are missing propTypes. (Default is false)
      requireComponentPropTypes: false,
    
      // Validate properties coming from a spread property (default is undefined)
      spreadProperty: 'options',
    
      // Throw errors instead of logging warnings (default is false)
      throwErrors: true,
    
      // Validate properties (default is true for all environments except "production")
      validate: true,
    
      // Validate properties when they are updated (default is false)
      validateOnUpdate: true
    }
  };
};
