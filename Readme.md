 
# 📝 Documentation d'Installation & Guide Docker

Ce projet est une application front-end en **JavaScript natif** composée de deux applications distinctes (`player-app` et `test-app`) partageant des ressources communes (`assets`, `components`, `data`...).

Pour éviter d'installer des serveurs locaux ou de subir des restrictions de sécurité du navigateur (erreurs CORS, modules JS bloqués en `file://`), l'environnement est entièrement conteneurisé avec **Docker Compose** et **Nginx**.

---

## 🚀 Guide d'Installation Rapide

### Prérequis

* Avoir **Docker** et **Docker Compose** installés sur votre machine.

### Étape 1 : Configuration de Docker Compose

À la racine du projet, assurez-vous d'avoir le fichier `docker-compose.yml` configuré pour mapper l'application principale et injecter les dossiers partagés à la place des liens symboliques locaux :

```yaml
services:
  # Première application (player-app) sur le port 8001
  player-application:
    image: nginx:alpine
    ports:
      - "8001:80"
    volumes:
      - ./player-app/:/usr/share/nginx/html/
      - ./assets/:/usr/share/nginx/html/assets/
      - ./components/:/usr/share/nginx/html/components/
      - ./data/:/usr/share/nginx/html/data/
      - ./pages/:/usr/share/nginx/html/pages/
      - ./src/:/usr/share/nginx/html/src/
      - ./env.js:/usr/share/nginx/html/env.js

  # Deuxième application (test-app) sur le port 8002
  test-application:
    image: nginx:alpine
    ports:
      - "8002:80"
    volumes:
      - ./test-app/:/usr/share/nginx/html/
      - ./assets/:/usr/share/nginx/html/assets/
      - ./components/:/usr/share/nginx/html/components/
      - ./data/:/usr/share/nginx/html/data/
      - ./pages/:/usr/share/nginx/html/pages/
      - ./src/:/usr/share/nginx/html/src/
      - ./env.js:/usr/share/nginx/html/env.js

```

### Étape 2 : Lancement des applications

Ouvrez un terminal à la racine du projet et exécutez la commande suivante :

```bash
docker compose up -d

```

### Étape 3 : Accès aux applications

* **Player App :** Naviguez vers [http://localhost:8001](http://localhost:8001)
* **Test App :** Naviguez vers [http://localhost:8002](http://localhost:8002)

---

## 🛠️ Commandes Utiles au Quotidien

* **Démarrer l'environnement :** `docker compose up -d`
* **Arrêter l'environnement :** `docker compose down`
* **Forcer la prise en compte de changements de configuration :** `docker compose up -d --force-recreate`
* **Nettoyer les conteneurs orphelins (anciens services renommés) :** `docker compose down --remove-orphans`

---

## 🔍 Guide de Dépannage (Troubleshooting & Bugs rencontrés)

Voici la liste des comportements et erreurs rencontrés durant la mise en place de cet environnement et leurs résolutions :

### 1. Erreur : `permission denied while trying to connect to the docker API`

* **Pourquoi ?** Sous Linux, l'utilisateur courant n'a pas les privilèges nécessaires pour communiquer avec Docker sans les droits `root`.
* **Solution :** Ajouter l'utilisateur au groupe Docker (à ne faire qu'une seule fois) :
```bash
sudo usermod -aG docker $USER
newgrp docker

```



### 2. Erreur : `Bind for :::8002 failed: port is already allocated`

* **Pourquoi ?** Le port 8001 ou 8002 est déjà utilisé, soit par un ancien conteneur Docker mal arrêté (souvent un conteneur orphelin suite à un renommage de service), soit par un processus de votre machine (ex: `php -S`).
* **Solution :** Forcer l'arrêt des conteneurs orphelins et tuer les processus bloquants :
```bash
docker compose down --remove-orphans
sudo kill -9 $(sudo lsof -t -i:8001 -i:8002)

```



### 3. Erreur : `403 Forbidden` sur les fichiers CSS/JS (Permissions Linux)

* **Pourquoi ?** Le serveur web d'Apache est très strict sous Linux. Lorsque les volumes sont montés, si l'utilisateur à l'intérieur du conteneur n'a pas les droits de lecture sur vos fichiers locaux, il bloque l'accès.
* **Solution :**
1. Redonner les droits de lecture à tout le monde sur le projet : `chmod -R o+rX .`
2. *Alternative retenue :* Utiliser des images **Nginx**, beaucoup plus souples avec la gestion des volumes locaux au cours du développement.



### 4. Bug : Fichiers statiques et dossiers partagés manquants (Liens symboliques brisés)

* **Pourquoi ?** Les applications utilisent des liens symboliques locaux (ex: `test-app/assets` pointant vers `../assets`). Docker étant isolé, il ne peut pas suivre un lien symbolique qui pointe en dehors du dossier de l'application. Le serveur web renvoie une erreur 403 ou 404 car il voit un lien brisé.
* **Solution :** Supprimer la dépendance aux liens symboliques dans l'environnement virtuel. On utilise les fonctionnalités multi-volumes de Docker Compose pour **monter directement les vrais dossiers parents** aux emplacements attendus à l'intérieur du conteneur (voir configuration du `docker-compose.yml`).