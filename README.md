# Petition designed with Jurassic Park Theme

## Website
https://reopenjurassicpark.herokuapp.com/ 

## Tech Stack
 * Javascript
 * NodeJS
 * ExpressJS
 * PostgreSQL
 * HTML5
 * HandlebarsJS
 * CSS3
 
## Overview
First, the user can register or log in. The password of new users is hashed before it is saved in the database.


![Project Image](https://github.com/imadarai/jurassic-park-petition/blob/master/gifs/petition1.gif?raw=true)

Afterwards, the user is prompted to fill in additional information about themselves. After doing so they are also prompted to sign the petition. The signature is turned into a URL, which is in turn stored in the database, together with the rest of the user's profile information.

![Project Image](https://github.com/imadarai/jurassic-park-petition/blob/master/gifs/petition2.gif?raw=true)

Upon signing, users can edit their profile, delete their signature, view fellow signers and filter signers by city.

![Project Image](https://github.com/imadarai/jurassic-park-petition/blob/master/gifs/petition3.gif?raw=true)

## Features
* Responsive Design
* CSRF Token
* Password Hashing using BCrypt
* Mouse and Touch Signature Option
* Error Messages using Handlebar



