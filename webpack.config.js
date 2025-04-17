module.exports = function(options){
    console.log('NODE_ENV : ', process.env.NODE_ENV);
    const isDevelopment = process.env.NODE_ENV === 'development';

    return {
        ...options,
        devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    }
}