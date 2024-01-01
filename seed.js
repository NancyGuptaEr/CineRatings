import { movieListingDataFuncs, authDataFuncs, adminMovies, moviesSearch } from "./data/index.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";


const db = await dbConnection();

if(db){
    console.log(`WE are connected to DB`);
}
else{
    console.log(`Error connecting to DB`);
}
async function addUserData(){

        const userInfo = await authDataFuncs.registerUser('whatsapp@samsung.com','Secure@123',18,'user','Drama', 'G');
        const userInfo1 = await authDataFuncs.registerUser('alice.smith@example.com', 'Al@12345', 25, 'user', 'Comedy', 'PG');
        const userInfo2 = await authDataFuncs.registerUser('bob.johnson@example.com', 'Bo@12345', 30, 'user', 'Action', 'PG-13');
        const userInfo3 = await authDataFuncs.registerUser('charlie.brown@example.com', 'Ch@12345', 22, 'user', 'Science Fiction', 'R');
        const userInfo4 = await authDataFuncs.registerUser('david.wilson@example.com', 'Da@12345', 28, 'user', 'Horror', 'R');
        const userInfo5 = await authDataFuncs.registerUser('emma.thomas@example.com', 'Em@12345', 35, 'user', 'Drama', 'PG');
        const userInfo6 = await authDataFuncs.registerUser('fiona.jackson@example.com', 'Fi@12345', 20, 'user', 'Romance','PG-13');
        const userInfo7 = await authDataFuncs.registerUser('george.martin@example.com', 'Ge@12345', 45, 'user', 'Drama', 'G');
        const userInfo8 = await authDataFuncs.registerUser('hannah.scott@example.com', 'Ha@12345', 38, 'user', 'Thriller', '18+');
        const userInfo9 = await authDataFuncs.registerUser('ian.white@example.com', 'Ia@12345', 27, 'user', 'Fantasy', 'R');
        const userInfo10 = await authDataFuncs.registerUser('julia.green@example.com', 'Ju@12345', 32, 'user', 'Adventure', 'G');


}
async function addMovieData(){

    const movieInfo1 = await adminMovies.addNewMovie('The Shawshank Redemption', ['Drama'], '09/23/1994', 'Frank Darabont', ['Tim Robbins', 'Morgan Freeman'], 'Stephen King', 'Niki Marvin', 'R', '/uploads/1234567890123-shawshank.jpg');
    const movieInfo2 = await adminMovies.addNewMovie('Inception', ['Science fiction'], '07/16/2010', 'Christopher Nolan', ['Leonardo DiCaprio', 'Ellen Page'], 'Christopher Nolan', 'Emma Thomas', 'PG-13', '/uploads/1234567890124-inception.jpg');
    const movieInfo3 = await adminMovies.addNewMovie('Forrest Gump', ['Drama'], '07/06/1994', 'Robert Zemeckis', ['Tom Hanks', 'Sally Field'], 'Eric Roth', 'Wendy Finerman', 'PG-13', '/uploads/1234567890125-forrestgump.jpg');
    const movieInfo4 = await adminMovies.addNewMovie('Pulp Fiction', ['Crime'], '10/14/1994', 'Quentin Tarantino', ['John Travolta', 'Samuel Jackson'], 'Quentin Tarantino', 'Lawrence Bender', 'R', '/uploads/1234567890126-pulpfiction.jpg');
    const movieInfo5 = await adminMovies.addNewMovie('The Dark Knight', ['Action'], '07/18/2008', 'Christopher Nolan', ['Christian Bale', 'Aaron Eckhart'], 'Jonathan Nolan', 'Christopher Nolan', 'PG-13', '/uploads/1234567890127-darkknight.jpg');
    const movieInfo6 = await adminMovies.addNewMovie('The Godfather', ['Crime'], '03/24/1972', 'Francis Ford Coppola', ['Marlon Brando', 'Al Pacino'], 'Mario Puzo', 'Albert Ruddy', 'R', '/uploads/1234567890128-godfather.jpg');
    const movieInfo7 = await adminMovies.addNewMovie('Casablanca', ['Romance'], '11/26/1942', 'Michael Curtiz', ['Humphrey Bogart', 'Ingrid Bergman'], 'Julius Epstein', 'Hal Wallis', 'PG', '/uploads/1234567890129-casablanca.jpg');
    const movieInfo8 = await adminMovies.addNewMovie('Citizen Kane', ['Drama'], '05/15/1941', 'Orson Welles', ['Orson Welles', 'Joseph Cotten'], 'Herman Mankiewicz', 'Orson Welles', 'PG', '/uploads/1234567890130-citizenkane.jpg');
    const movieInfo9 = await adminMovies.addNewMovie('Parasite', ['Thriller'], '05/30/2019', 'Bong Joonho', ['Song Kangho', 'Lee Sunkyun'], 'Bong Joonho', 'Kwak Sinae', 'R', '/uploads/1234567890131-parasite.jpg');
    const movieInfo10 = await adminMovies.addNewMovie('Mad Max: Fury Road', ['Action'], '05/15/2015', 'George Miller', ['Tom Hardy', 'Charlize Theron'], 'George Miller', 'Doug Mitchell', 'R', '/uploads/1234567890132-madmax.jpg');
    const movieInfo11 = await adminMovies.addNewMovie('Whiplash', ['Drama'], '10/17/2014', 'Damien Chazelle', ['Miles Teller', 'JK Simmons'], 'Damien Chazelle', 'Jason Blum', 'R', '/uploads/1234567890133-whiplash.jpg');
    const movieInfo12 = await adminMovies.addNewMovie('The Grand Budapest Hotel', ['Comedy'], '03/07/2014', 'Wes Anderson', ['Ralph Fiennes', 'Tony Revolori'], 'Wes Anderson', 'Jeremy Dawson', 'R', '/uploads/1234567890134-grandbudapest.jpg');
    const movieInfo13 = await adminMovies.addNewMovie('Spirited Away', ['Animation'], '07/20/2001', 'Hayao Miyazaki', ['Rumi Hiiragi', 'Yoji Matsuda'], 'Hayao Miyazaki', 'Toshio Suzuki', 'G', '/uploads/1234567890135-spiritedaway.jpg');
    const movieInfo14 = await adminMovies.addNewMovie('Crouching Tiger, Hidden Dragon', ['Drama'], '08/18/2000', 'Ang Lee', ['Michelle Yeoh', 'Zhang Ziyi'], 'Wang Huiling', 'Bill Kong', 'PG-13', '/uploads/1234567890136-crouchingtiger.jpg');
    const movieInfo15 = await adminMovies.addNewMovie('Cinema Paradiso', ['Drama'], '11/25/1988', 'Giuseppe Tornatore', ['Philippe Noiret', 'Salvatore Cascio'], 'Giuseppe Tornatore', 'Franco Cristaldi', 'PG', '/uploads/1234567890137-cineparadiso.jpg');
    const movieInfo16 = await adminMovies.addNewMovie('Amelie', ['Comedy', 'Romance'], '04/25/2001', 'Jean Pierre Jeunet', ['Audrey Tautou', 'Mathieu Kassovitz'], 'Guillaume Laurant', 'Claudie Ossard', 'R', '/uploads/1234567890148-amelie.jpg');
    const movieInfo17 = await adminMovies.addNewMovie('Y Tu Mama Tambien', ['Drama'], '06/08/2001', 'Alfonso Cuaron', ['Gael Garcia Bernal', 'Diego Luna'], 'Carlos Cuaron', 'Jorge Vergara', 'R', '/uploads/1234567890149-ytumamatambien.jpg');
    const movieInfo18 = await adminMovies.addNewMovie('Eternal Sunshine of the Spotless Mind', ['Drama', 'Romance'], '03/19/2004', 'Michel Gondry', ['Jim Carrey', 'Kate Winslet'], 'Charlie Kaufman', 'Steve Golin', 'R', '/uploads/1234567890150-eternalsunshine.jpg');
    const movieInfo19 = await adminMovies.addNewMovie('The Secret Life of Walter Mitty', ['Adventure', 'Comedy'], '12/25/2013', 'Ben Stiller', ['Ben Stiller', 'Kristen Wiig'], 'Steve Conrad', 'Samuel Goldwyn Jr', 'PG', '/uploads/1234567890151-waltermitty.jpg');
    const movieInfo20 = await adminMovies.addNewMovie('Sing Street', ['Musicals', 'Drama'], '04/15/2016', 'John Carney', ['Ferdia Walsh Peelo', 'Lucy Boynton'], 'John Carney', 'Anthony Bregman', 'PG-13', '/uploads/1234567890152-singstreet.jpg');
    const movieInfo21 = await adminMovies.addNewMovie('Knives Out', ['Mystery', 'Comedy'], '11/27/2019', 'Rian Johnson', ['Daniel Craig', 'Chris Evans'], 'Rian Johnson', 'Ram Bergman', 'PG-13', '/uploads/1234567890153-knivesout.jpg');
    const movieInfo22 = await adminMovies.addNewMovie('The Farewell', ['Drama'], '07/12/2019', 'Lulu Wang', ['Tzi Ma'], 'Lulu Wang', 'Anita Gou', 'PG', '/uploads/1234567890154-thefarewell.jpg');
    const movieInfo23 = await adminMovies.addNewMovie('The Departed', ['Drama', 'Thriller'], '10/06/2006', 'Martin Scorsese', ['Leonardo DiCaprio', 'Matt Damon'], 'William Monahan', 'Brad Pitt', 'R', '/uploads/1234567890155-thedeparted.jpg');
    const movieInfo24 = await adminMovies.addNewMovie('Memento', ['Mystery', 'Thriller'], '10/11/2000', 'Christopher Nolan', ['Guy Pearce', 'Carrie Anne Moss'], 'Christopher Nolan', 'Jennifer Todd', 'R', '/uploads/1234567890156-memento.jpg');
    const movieInfo25 = await adminMovies.addNewMovie('Pulp Fiction', ['Drama', 'Crime'], '10/14/1994', 'Quentin Tarantino', ['John Travolta', 'Samuel Jackson'], 'Quentin Tarantino', 'Lawrence Bender', 'R', '/uploads/1234567890157-pulpfiction.jpg');
    const movieInfo26 = await adminMovies.addNewMovie('The Lord of the Rings: The Fellowship of the Ring', ['Fantasy', 'Adventure'], '12/19/2001', 'Peter Jackson', ['Elijah Wood', 'Ian McKellen'], 'JRR Tolkien', 'Peter Jackson', 'PG-13', '/uploads/1234567890158-lordoftherings.jpg');
    const movieInfo27 = await adminMovies.addNewMovie('The Matrix', ['Science Fiction'], '03/31/1999', 'Lana Wachowski', ['Keanu Reeves', 'Laurence Fishburne'], 'Lana Wachowski', 'Joel Silver', 'R', '/uploads/1234567890159-matrix.jpg');
    const movieInfo28 = await adminMovies.addNewMovie('Schindlers List', ['Drama'], '12/15/1993', 'Steven Spielberg', ['Liam Neeson', 'Ben Kingsley'], 'Thomas Keneally', 'Steven Spielberg', 'R', '/uploads/1234567890160-schindlerslist.jpg');
    const movieInfo29 = await adminMovies.addNewMovie('The Princess Bride', ['Adventure', 'Fantasy'], '09/25/1987', 'Rob Reiner', ['Cary Elwes', 'Robin Wright'], 'William Goldman', 'Rob Reiner', 'PG', '/uploads/1234567890161-princessbride.jpg');
    const movieInfo30 = await adminMovies.addNewMovie('Raiders of the Lost Ark', ['Adventure', 'Action'], '06/12/1981', 'Steven Spielberg', ['Harrison Ford', 'Karen Allen'], 'Lawrence Kasdan', 'Frank Marshall', 'PG', '/uploads/1234567890162-raiders.jpg');
    const movieInfo31 = await adminMovies.addNewMovie('12 Angry Men', ['Drama'], '04/10/1957', 'Sidney Lumet', ['Henry Fonda', 'Lee J Cobb'], 'Reginald Rose', 'Henry Fonda', 'NC-17', '/uploads/1234567890163-12angrymen.jpg');
    const movieInfo32 = await adminMovies.addNewMovie('The Big Lebowski', ['Comedy', 'Crime'], '03/06/1998', 'Joel Coen', ['Jeff Bridges', 'John Goodman'], 'Ethan Coen', 'Ethan Coen', 'R', '/uploads/1234567890164-biglebowski.jpg');
    const movieInfo33 = await adminMovies.addNewMovie('Good Will Hunting', ['Drama'], '12/05/1997', 'Gus Van Sant', ['Robin Williams', 'Matt Damon'], 'Matt Damon', 'Lawrence Bender', 'R', '/uploads/1234567890165-goodwillhunting.jpg');
    const movieInfo34 = await adminMovies.addNewMovie('The Lion King', ['Animation', 'Adventure'], '06/15/1994', 'Roger Allers', ['Matthew Broderick', 'Jeremy Irons'], 'Irene Mecchi', 'Don Hahn', 'G', '/uploads/1234567890166-lionking.jpg');
    const movieInfo35 = await adminMovies.addNewMovie('Spirited Away', ['Animation', 'Fantasy'], '07/20/2001', 'Hayao Miyazaki', ['Rumi Hiiragi', 'Miyu Irino'], 'Hayao Miyazaki', 'Toshio Suzuki', 'PG', '/uploads/1234567890167-spiritedaway.jpg');
    const movieInfo36 = await adminMovies.addNewMovie('Ponyo', ['Animation', 'Adventure'], '07/19/2008', 'Hayao Miyazaki', ['Yuria Nara', 'Hiroki Doi'], 'Hayao Miyazaki', 'Toshio Suzuki', 'G', '/uploads/1234567890168-ponyo.jpg');
    const movieInfo37 = await adminMovies.addNewMovie('Howls Moving Castle', ['Animation', 'Fantasy'], '11/20/2004', 'Hayao Miyazaki', ['Chieko Baisho', 'Takuya Kimura'], 'Hayao Miyazaki', 'Toshio Suzuki', 'PG', '/uploads/1234567890169-howlsmovingcastle.jpg');
    const movieInfo38 = await adminMovies.addNewMovie('Princess Mononoke', ['Animation', 'Adventure'], '07/12/1997', 'Hayao Miyazaki', ['Yoji Matsuda', 'Yuriko Ishida'], 'Hayao Miyazaki', 'Toshio Suzuki', 'PG-13', '/uploads/1234567890170-princessmononoke.jpg');
    const movieInfo39 = await adminMovies.addNewMovie('My Neighbor Totoro', ['Animation', 'Family'], '04/16/1988', 'Hayao Miyazaki', ['Noriko Hidaka', 'Chika Sakamoto'], 'Hayao Miyazaki', 'Toru Hara', 'G', '/uploads/1234567890171-myneighbortotoro.jpg');
    const movieInfo40 = await adminMovies.addNewMovie('Paprika', ['Animation', 'Science Fiction'], '11/25/2006', 'Satoshi Kon', ['Megumi Hayashibara', 'Toru Emori'], 'Satoshi Kon', 'Masao Maruyama', 'R', '/uploads/1234567890172-paprika.jpg');
    const movieInfo41 = await adminMovies.addNewMovie('The Wind Rises', ['Animation', 'Biography'], '07/20/2013', 'Hayao Miyazaki', ['Hideaki Anno', 'Hidetoshi Nishijima'], 'Hayao Miyazaki', 'Toshio Suzuki', 'PG-13', '/uploads/1234567890173-thewindrises.jpg');
    const movieInfo42 = await adminMovies.addNewMovie('Blade Runner', ['Science Fiction', 'Thriller'], '06/25/1982', 'Ridley Scott', ['Harrison Ford', 'Rutger Hauer'], 'Hampton Fancher', 'Michael Deeley', 'R', '/uploads/1234567890174-bladerunner.jpg');
    const movieInfo43 = await adminMovies.addNewMovie('Fight Club', ['Drama', 'Thriller'], '10/15/1999', 'David Fincher', ['Brad Pitt', 'Edward Norton'], 'Chuck Palahniuk', 'Art Linson', 'R', '/uploads/1234567890175-fightclub.jpg');
    const movieInfo44 = await adminMovies.addNewMovie('Arrival', ['Science Fiction', 'Drama'], '11/11/2016', 'Denis Villeneuve', ['Amy Adams', 'Jeremy Renner'], 'Eric Heisserer', 'Shawn Levy', 'PG-13', '/uploads/1234567890176-arrival.jpg');
    const movieInfo45 = await adminMovies.addNewMovie('Ex Machina', ['Science Fiction', 'Drama'], '04/24/2015', 'Alex Garland', ['Domhnall Gleeson', 'Alicia Vikander'], 'Alex Garland', 'Andrew Macdonald', 'R', '/uploads/1234567890177-exmachina.jpg');
    const movieInfo46 = await adminMovies.addNewMovie('Moon', ['Science Fiction', 'Drama'], '07/10/2009', 'Duncan Jones', ['Sam Rockwell', 'Kevin Spacey'], 'Nathan Parker', 'Stuart Fenegan', 'R', '/uploads/1234567890178-moon.jpg');
    const movieInfo47 = await adminMovies.addNewMovie('Interstellar', ['Science Fiction', 'Adventure'], '11/07/2014', 'Christopher Nolan', ['Matthew McConaughey', 'Anne Hathaway'], 'Jonathan Nolan', 'Lynda Obst', 'PG-13', '/uploads/1234567890179-interstellar.jpg');
    const movieInfo48 = await adminMovies.addNewMovie('The Martian', ['Science Fiction', 'Adventure'], '10/02/2015', 'Ridley Scott', ['Matt Damon', 'Jessica Chastain'], 'Drew Goddard', 'Simon Kinberg', 'PG-13', '/uploads/1234567890180-themartian.jpg');
    const movieInfo49 = await adminMovies.addNewMovie('Gravity', ['Science Fiction', 'Thriller'], '10/04/2013', 'Alfonso Cuaron', ['Sandra Bullock', 'George Clooney'], 'Alfonso Cuaron', 'Alfonso Cuaron', 'PG-13', '/uploads/1234567890181-gravity.jpg');
    const movieInfo50 = await adminMovies.addNewMovie('Dunkirk', ['Action', 'Drama'], '07/21/2017', 'Christopher Nolan', ['Fionn Whitehead', 'Tom Glynn Carney'], 'Christopher Nolan', 'Emma Thomas', 'PG-13', '/uploads/1234567890182-dunkirk.jpg');

}
try{
    let userInfo = await addUserData();
    let MovieInfo = await addMovieData();

}
catch(error){
    console.log(`Error: ${error}`);
}

await closeConnection();
console.log(`DB connection terminated`);
