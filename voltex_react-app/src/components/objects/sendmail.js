//This file will be used in v2 to send mails from the server

//import nodemailer for send mail
import Nodemail from 'nodemailer';

//Property important
import PropTypes from 'prop-types';


//import properties of the vm mail account
// import keys from '../../../../Routes/config/keys';



mail.propTypes = {
 subject: PropTypes.string.isRequired,
 to: PropTypes.string.isRequired,
}

export default mail;