class ErrorHandler extends Error{
    statusCode:number;
    constructor(message:string,statusCode:number){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}
 export default ErrorHandler;