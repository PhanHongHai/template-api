export function FailureRespone(res: any, error: any): any {
  let status = error.status ? error.status : 500;
  res.status(status);
  res.json({
    errors: error.message ? error.message : 'Unknown error',
    name: error.name ? error.name : 'Unknown error',
    status: status,
  });
}

export function SuccessRespone(res: any, result: any = {}) {
  res.json({
    result: result ? result : {},
    status: 200
  });
}