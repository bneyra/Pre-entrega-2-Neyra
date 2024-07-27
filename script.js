

// Aqui esta mi pre entrega 2, lo que hice fue generar, (o el intento, porque me costo!) de una base de datos que se actualice cada vez que ocurre una transferencia de un jugador de un club a otro, en un futuro me gustaria tambien agregar mas cosas, como por ejemplo valores del mercado, estadisticas y muchas cosas mas! Neyra Benjamin.

class IDGenerator {
    constructor(base) {
        this.last_id = base;
    }

    get_next_id() {
        this.last_id += 1;
        return this.last_id;
    }
}

class Player {
    constructor(name, lastname, age, position, team) {
        this.name = capitalize(name);
        this.lastname = capitalize(lastname);
        this.age = age;
        this.position = position;
        this.team = team;
        this.posts = [];
        this.createUsername();
    }

    createUsername() {
        let arg1 = this.name.toLowerCase()[0];
        let arg2 = this.lastname.toLowerCase();
        this.username = `${arg1}${arg2}`;
    }
}

class Transfer {
    constructor(id, username, fromTeam, toTeam) {
        this.id = id;
        this.username = username;
        this.fromTeam = fromTeam;
        this.toTeam = toTeam;
        this.date = new Date();
    }
}

// aqui estan las utilidades principales 
function capitalize(str) {
    if (str.length <= 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function get_formatted_date(date) {
    const anio = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    const segundos = date.getSeconds().toString().padStart(2, '0');
    
    return `${anio}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
}

function sort_posts(posts, property, dir) {
    let arrayCopia = posts.map(el => el);
    return arrayCopia.sort((a, b) => {
        if (dir === 'asc') {
            return a[property] > b[property] ? 1 : (a[property] < b[property] ? -1 : 0);
        } else if (dir === 'desc') {
            return a[property] < b[property] ? 1 : (a[property] > b[property] ? -1 : 0);
        } else {
            return 0;
        }
    });
}

// Funciones del HTML
function update_posts_list(posts) {
    let posts_list = document.getElementsByClassName('post__list')[0];
    posts_list.innerHTML = '';
    posts.forEach(post => {
        posts_list.innerHTML += `
        <li class="post__list__item">
            <div class="post__list__item__user">
                <h3>${post.username}</h3>
            </div>
            <div class="post__list__item__content">
                <p>Transferencia de ${post.fromTeam} a ${post.toTeam}</p>
            </div>
            <div class="post__list__item__date">
                <p>${get_formatted_date(post.date)}</p>
            </div>
        </li>
        `;
    });
}

// registros
function createTransfer(players, tmp_id) {
    if (players.length <= 0) {
        alert('No hay jugadores registrados en la base de datos!');
        return NaN;
    }
    
    let found = false;
    let player;
    let username;
    
    while (!username) {
        username = prompt('Ingrese el nombre de usuario del jugador:');
        if (!username) {
            alert('Ingrese un nombre de usuario para continuar!');
        }
    }
    
    for (let kk = 0; kk < players.length; kk++) {
        player = players[kk];
        if (player.username === username) {
            found = true;
            break;
        }
    }
    
    if (!found) {
        alert(`No se encontró al jugador [${username}] en la base de datos.`);
        return NaN;
    }
    
    let fromTeam = player.team;
    let toTeam = String(prompt(`Ingrese el nuevo equipo para [${player.username}]:`));
    
    if (!toTeam) {
        alert('Debe ingresar un equipo válido!');
        return NaN;
    }

    let transfer = new Transfer(tmp_id, player.username, fromTeam, toTeam);
    player.team = toTeam; // Actualiza el equipo del jugador
    player.posts.push(transfer);
    return transfer;
}

function showTransfers(posts) {
    if (posts.length <= 0) {
        alert('No hay transferencias registradas en la base de datos!');
        return;
    }
    
    let sorted_posts = sort_posts(posts, 'date', 'desc');
    let opt;
    
    while (!opt) {
        opt = Number(prompt(
            'Elija una opción\n' +
            '1. Ver todas las transferencias\n' +
            '2. Filtrar por jugador\n' +
            '3. Filtrar por fecha'
        ));
        if (!opt) {
            alert('Ingrese una opción válida para continuar!');
        }
    }
    
    if (opt === 1) {
        let msg = '';
        sorted_posts.forEach(post => {
            msg += `(${post.id}) ${post.username} transferido de ${post.fromTeam} a ${post.toTeam} [${get_formatted_date(post.date)}]\n`;
        });
        alert(msg);
        update_posts_list(sorted_posts);
    } else if (opt === 2) {
        let username;
        while (!username) {
            username = prompt('Ingrese el nombre de usuario del jugador');
            if (!username) {
                alert('Ingrese un nombre de usuario para continuar!');
            }
        }
        
        const player_posts = sorted_posts.filter(post => post.username === username);
        if (player_posts.length > 0) {
            let msg = player_posts.map(post => `(${post.id}) ${post.username} transferido de ${post.fromTeam} a ${post.toTeam} [${get_formatted_date(post.date)}]`).join('\n');
            alert(msg);
            update_posts_list(player_posts);
        } else {
            alert('El jugador no existe o no ha sido transferido aún.');
        }
    } else if (opt === 3) {
        let date;
        let data;
        while (!date) {
            date = prompt('Ingrese la fecha (YYYY-MM-DD)');
            data = date.split('-');
            if (!date || data.length < 3) {
                alert('Ingrese una fecha válida para continuar!');
            }
        }
        
        const year = Number(data[0]);
        const month = Number(data[1]);
        const day = Number(data[2]);
        
        const filt_posts = sorted_posts.filter(post => 
            post.date.getFullYear() === year &&
            (post.date.getMonth() + 1) === month &&
            post.date.getDate() === day
        );
        
        if (filt_posts.length > 0) {
            let msg = filt_posts.map(post => `(${post.id}) ${post.username} transferido de ${post.fromTeam} a ${post.toTeam} [${get_formatted_date(post.date)}]`).join('\n');
            alert(msg);
            update_posts_list(filt_posts);
        } else {
            alert('No hay transferencias en la fecha seleccionada!.');
        }
    }
}

function deleteTransfers(posts) {
    if (posts.length <= 0) {
        alert('No hay transferencias registradas en la base de datos!');
        return;
    }
    
    let post_id = Number(prompt('Ingrese el ID de la transferencia a borrar'));
    const post_index = posts.findIndex(post => post.id === post_id);
    
    if (post_index !== -1) {
        posts.splice(post_index, 1);
        alert(`La transferencia con ID ${post_id} ha sido borrada con éxito.`);
    } else {
        alert(`La transferencia con ID ${post_id} no existe.`);
    }
}

function createPlayer() {
    let name = prompt('Ingrese el nombre del jugador');
    let surname = prompt('Ingrese el apellido del jugador');
    let age = Number(prompt('Ingrese la edad del jugador'));
    let position = prompt('Ingrese la posición del jugador');
    let team = prompt('Ingrese el equipo del jugador');
    
    let player = new Player(name, surname, age, position, team);
    return player;
}

function showPlayers(players) {
    if (players.length <= 0) {
        alert('No hay jugadores registrados en la base de datos!');
        return;
    }
    
    console.log('Lista de jugadores:');
    players.forEach(player => console.log(player));
}

function generateTestData(database) {
    let test_players = [
        { name: 'Lionel', surname: 'Messi', age: 35, position: 'Delantero', team: 'Inter Miami' },
        { name: 'Cristiano', surname: 'Ronaldo', age: 37, position: 'Delantero', team: 'Al-Nassr' },
        { name: 'Kylian', surname: 'Mbappe', age: 23, position: 'Delantero', team: 'PSG' },
        { name: 'Agustin', surname: 'Palavecino', age: 27, position: 'Mediocampista', team: 'Necaxas' },
        { name: 'Ignacio', surname: 'Fernandez', age: 34, position: 'Mediocampista', team: 'River Plate' },
    ];
    
    test_players.forEach(test_player => {
        let player = new Player(test_player.name, test_player.surname, test_player.age, test_player.position, test_player.team);
        database.players.push(player);
    });
    
    let test_transfers = [
        { id: 1000, username: 'lmessi', fromTeam: 'Barcelona', toTeam: 'Inter Miami', date: '2024-07-01T10:06:20' },
        { id: 1001, username: 'cronaldo', fromTeam: 'Juventus', toTeam: 'Al-Nassr', date: '2024-07-02T11:03:10' },
        { id: 1002, username: 'kmbappe', fromTeam: 'PSG', toTeam: 'RealMadrid', date: '2024-07-03T12:44:00' },
        { id: 1003, username: 'Apalavecino', fromTeam: 'RiverPlate', toTeam: 'Necaxas', date: '2024-07-04T17:00:10' },
        { id: 1004, username: 'Nfernandez', fromTeam: 'AtLetico Mineiro', toTeam: 'River Plate', date: '2024-07-05T20:35:56' },
    ];
    
    test_transfers.forEach(test_transfer => {
        let transfer = new Transfer(test_transfer.id, test_transfer.username, test_transfer.fromTeam, test_transfer.toTeam);
        transfer.date = new Date(test_transfer.date);
        database.posts.push(transfer);
    });
    
    alert('Los datos de prueba han sido generados exitosamente');
}

// Principal bulce
function main() {
    let exit = false;
    let menuOption = NaN;
    let player = NaN;
    let post = NaN;
    
    const database = {
        players: [],
        posts: [],
    };
    
    let id_gen = new IDGenerator(10);
    
    while (exit === false) {
        menuOption = prompt(
            'Menu principal\n' +
            '1. Registrar transferencia\n' +
            '2. Ver transferencias\n' +
            '3. Borrar transferencias\n' +
            '4. Registrar jugador\n' +
            '5. Ver jugadores (por consola)\n' +
            '6. Generar datos de prueba\n' +
            '0. Salir\n'
        );

        if (!menuOption) {
            alert('Ups, Opción incorrecta! Vuelva a intentarlo.');
            continue;
        }

        menuOption = Number(menuOption);
        
        switch (menuOption) {
            case 1:
                post = createTransfer(database.players, id_gen.get_next_id());
                if (post) {
                    database.posts.push(post);
                }
                break;
            case 2:
                showTransfers(database.posts);
                break;
            case 3:
                deleteTransfers(database.posts);
                break;
            case 4:
                player = createPlayer();
                if (player) {
                    database.players.push(player);
                }
                break;
            case 5:
                showPlayers(database.players);
                break;
            case 6:
                generateTestData(database);
                break;
            case 0:
                exit = true;
                break;
            default:
                alert('Ups, Opción incorrecta! Vuelva a intentarlo.');
                break;
        }
    }
}

main();
