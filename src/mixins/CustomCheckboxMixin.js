var React = require('react');

var CustomCheckboxMixin = {

    renderCustomCheckbox: function(opts) {

        var labelText = (<span>{opts.label}</span>) || null;

        return (
            <div className='checkbox'>
              <label>
                <input {...opts}/>
                    {labelText}
              </label>
            </div>
        );
    }
};

module.exports = CustomCheckboxMixin;
