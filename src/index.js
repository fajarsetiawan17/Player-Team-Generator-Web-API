// /////////////////////////////////////////////////////////////////////////////
// IMPORTANT:
// THE CODE BELOW IS READ ONLY CODE AND YOU SHOULD INSPECT IT TO SEE WHAT IT
// DOES IN ORDER TO COMPLETE THE TASK, BUT DO NOT MODIFY IT IN ANY WAY AS THAT
// WILL RESULT IN A TEST FAILURE
// /////////////////////////////////////////////////////////////////////////////

import app from './api';
import database from './db';

const port = 3000

database.sync().then(
  () => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  }
)

export default app;