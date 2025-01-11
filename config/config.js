require("dotenv").config()

const pg = require("pg")


module.exports={
  development: {
    username: process.env.POSTGRESS_USER,
    password: process.env.POSTGRESS_PASSWORD,
    database: process.env.POSTGRESS_DATABASE,
    host: process.env.POSTGRESS_HOST,
    dialect: "postgres",
    dialectModule:pg,
    dialectOptions:{
      ssl:{
        require:true,
        rejectUnauthorized:false
      }
    }
  },

  production: {
    username: process.env.POSTGRESS_USER,
    password: process.env.POSTGRESS_PASSWORD,
    database: process.env.POSTGRESS_DATABASE,
    host: process.env.POSTGRESS_HOST,
    dialect: "postgres",
    dialecModule:pg,
    dialectOptions:{
      ssl:{
        require:true,
        rejectUnauthorized:false
      }
    }
  },
  
 
}
