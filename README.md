# goldenspear-simple-backend

This is a simple Node backend to provide user authentication (`login` and `signup` endpoints) and token-authenticated communication for the front end (with  
[JSON web tokens](https://jwt.io/)) 

##### The corresponding front end can be found [here](https://github.com/lluissuros/goldenspear-react-contacts-app)


### How to use
First time: `npm install` for dependencies

Get it up and running: `npm start`

#### Endpoints
*Assuming the default localhost:3001 configuration*
  * **Login endpoint** [POST]: `http://localhost:3001/users/login`
  * **Signup endpoint**  [POST]: `http://localhost:3001/users/signup`
  * **Contacts endpoint**  [GET]: `http://localhost:3001/contacts`

`login` and  `signup` endpoints expect a `{username, password}` object in the request body, and return a jwt to be used in further requests.

 `contacts` expects a valid jwt in the request header, in the shape of `Authorization : Bearer [myToken]`. If the token is valid, it will return the contacts.json




# Some relevant information

* I am using [lowdb](https://github.com/typicode/lowdb) as a lightweight database. The first time you run it, it will create a .json file in `data/database.json` with the data. 

* The JWT are encoded with a secret key that is saved under `config/default.json`. The front-end needs to know the **same secret key**  in order to decode the data!

* I learned many things doing this part. Actually, almost everything was quite new :)

