# PokemonDB
A simple Pokemon Database featuring the first 151 Pokemon, the original 8 Gyms and Gym Leaders and their respective badges, and the ability for an end user to create and edit their own trainers.

## About

This project has two parts. The backend end database uses mySQL and is interacted with via the PHP [Slim](http://www.slimframework.com/) framework. The front-end is made using HTML, CSS, and JavaScript  (the [Angular.js](https://angularjs.org/) framework, specifically).

## How-To - Setup
1. Clone this repo or download the .zip file.
2. To simply run this on your local machine, make sure you have [WAMP](https://www.mamp.info/en/downloads/), [MAMP](https://www.mamp.info/en/downloads/), or [LAMP](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-14-04) installed. (respectively, for Windows, Mac, or Linux).
3. Start up your application, and put the uncompressed PokemonDB folder in the hosting location.
4. On your localhost, log into the phpmyadmin (if using MAMP, will be [http://localhost:8888/phpmyadmin](http://localhost:8888/phpmyadmin) )
5. Create a new database named "PokemonDB".
6. Almost done! The only thing left is to change the DB connection configuration and the javascript url. To do this, go into PokemonDB>backend>database.php. You should see a variable called `$localConfig` and a method called `sharedDB()`. Make sure that local config is set in the `sharedDB()` method, and that the localConfig properties are correct for your host. (If you're using MAMP, it should be correct.) Look below for help.
7. In PokemonDB>frontend>js>factories>API.js , simply change the `baseURL` to match your host. (If using MAMP, the second one that has 'localhost:8888' should be correct.) See below for a visual.

``` PHP
  private static $localConfig = array( /* <-- change these properties as needed */
        "host"=>"localhost",
        "user"=>"root",
        "pass"=>"root",
        "db"=>"PokemonDB",
        "port"=>8889
    );

    public static function sharedDB() {
        if (Database::$singleton === null) {
            $config = self::$remoteConfig; /* <-- change this to $localConfig */
            Database::$singleton = new mysqli(
                $config["host"],
                $config["user"],
                $config["pass"],
                $config["db"],
                $config["port"]
            );

            $connection = Database::$singleton;
            if ($connection->connect_error) {
                die("Connection failed: " . $connection->connect_error);
            }
        }
        return Database::$singleton;
    }
```

```JavaScript
      var baseURL = "http://bgroff-pi2.dhcp.bsu.edu/PokemonDB/backend";
//    var baseURL = "http://localhost:8888/PokemonDB/backend"; <-- Change this one and reverse the commenting on these.

```

### Disclaimer

Pokemon is not an original idea by us, nor is a PokemonDB. All of these images are not ours, but simply gathered from the web for use in an educational project. We claim no rights to Pokemon, the images, or even parts of our sites design theme. 
