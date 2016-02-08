<?php
class Database {

    private static $singleton = null;
    private static $remoteConfig = array(
        "host"=>"ec2-54-152-79-10.compute-1.amazonaws.com",
        "user"=>"PokemonDB",
        "pass"=>"JY2HanXBQ7DGLYfz",
        "db"=>"PokemonDB",
        "port"=>3306
    );

    private static $localConfig = array(
        "host"=>"localhost",
        "user"=>"root",
        "pass"=>"root",
        "db"=>"PokemonDB",
        "port"=>8889
    );

    public static function sharedDB() {
        if (Database::$singleton === null) {
            $config = self::$remoteConfig;
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

    public static function query($sql) {
        return self::sharedDB()->query($sql);
    }

}