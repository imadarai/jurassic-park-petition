# Petition designed with Jurassic Park Theme

## Website
http://reopenpark.herokuapp.com/ 

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

![Project Image]()

Afterwards, the user is prompted to fill in additional information about themselves. After doing so they are also prompted to sign the petition. The signature is turned into a URL, which is in turn stored in the database, together with the rest of the user's profile information.

![Project Image]()

Upon signing, users can edit their profile, delete their signature, view fellow signers and filter signers by city.

![Project Image]()

## Features
* Responsive Design
* CSRF Token
* Password Hashing using BCrypt
* Mouse and Touch Signature Option
* Error Messages using Handlebar



