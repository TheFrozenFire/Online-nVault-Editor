<?php
class lobstore {
	private $pdo;

	public function __construct() {
		if(!file_exists("./lobstore/")) {
			if(!mkdir("lobstore")) {
				return -1; // Couldn't create the directory
			} else {
				if(!file_put_contents("lobstore/.htaccess", "Deny from All")) return -1;
			}
		}
		if(!file_exists("lobstore/lobstore.sqlite")) $this->generateStore(); else $this->pdo = new PDO("sqlite:lobstore/lobstore.sqlite");
	}
	
	public function newObject($object) {
		$id = uniqid();
		
		$statement = $this->pdo->prepare("INSERT INTO objects (id, object) VALUES (?, ?)");
		$statement->bindValue(1, $id);
		$statement->bindValue(2, $object);
		
		if(!$result = $statement->execute()) return $result; else return $id;
	}
	
	public function updateObject($id, $object) {
		$statement = $this->pdo->prepare("UPDATE objects SET object = ? WHERE id = ?");
		$statement->bindValue(1, $object);
		$statement->bindValue(2, $id);
		
		return $statement->execute();
	}
	
	public function getObject($id) {
		$statement = $this->pdo->prepare("SELECT id, time, object from objects WHERE id = ? LIMIT 1");
		$statement->bindValue(1, $id);
		
		if($statement->execute()) return $statement->fetch(PDO::FETCH_ASSOC); else return FALSE;
	}
	
	private function generateStore() {
		$this->pdo = new PDO("sqlite:lobstore/lobstore.sqlite");
		
		$this->pdo->exec("CREATE TABLE IF NOT EXISTS objects(id TEXT PRIMARY KEY NOT NULL, time INTEGER NOT NULL DEFAULT (strftime('%s','now')), object TEXT NOT NULL)");
		$this->pdo->exec("CREATE TRIGGER IF NOT EXISTS pruneObjects BEFORE INSERT ON objects BEGIN DELETE FROM objects WHERE (strftime('%s','now') - objects.time) > 172800); END");
		$this->pdo->exec("CREATE TRIGGER IF NOT EXISTS updateTime BEFORE UPDATE ON objects FOR EACH ROW BEGIN UPDATE objects SET OLD.time = strftime('%s','now') WHERE id = OLD.id; END");
	}
}
?>
