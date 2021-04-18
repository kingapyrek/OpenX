async function getData(url) {
    var response = await fetch(url).then(response => response.json());
    return response;
}

function listOfPosts(users, posts)
{
    var htmlResult = '';
    for(user of users)
    {
        for(post of posts)
        {
            if(user.id == post.userId)
            {
                htmlResult += '<div class="card m-3">';
                htmlResult += `<h5 class="card-header">${post.title}</h5>`;
                htmlResult += '<div class="card-body">';
                htmlResult += `<h5 class="card-title"><i class="fas fa-user"></i>${user.username}</h5>`;
                htmlResult += `<p class="card-text">${post.body}</p></div></div>`;
            }
        }
    }
    return htmlResult;
}


function countPosts(posts, users)
{
    var htmlResult = '';
    for(user of users)
    {
        var tmp = 0;
        for(post of posts)
        {
            if(post.userId == user.id)
            {
                tmp++;
            }
        }

        htmlResult += `${user.username} napisal(a) ${tmp} postow.<br>`;
    }
    return htmlResult;

}

function repeatPost(posts)
{
    var result = {};
    var htmlResult = '';

    for(post of posts)
    {
        if(post.title in result)
        {
            result[post.title] += 1;
        }
        else
        {
            result[post.title] = 1;
        }
    }

    if(Object.keys(result).length == posts.length)
    {
        htmlResult += 'Żadne tytuły się nie powtarzają';
    }
    else
    {
        for(el in result)
        {
            if(result[el] != 1)
            {    
                htmlResult += `${el}<br>`;
            }
        }
    }

    return htmlResult;

}

function getDistances(users)
{
    var distances = {};
    for(user of users)
    {
        var userDist = {};
        for(anotherUser of users)
        {
           
            if(anotherUser.id != user.id){
                var lat1 = user.address.geo.lat;
                var lng1 = user.address.geo.lng;
                var lat2 = anotherUser.address.geo.lat;
                var lng2 = anotherUser.address.geo.lng;

                userDist[anotherUser.id] = countDistance(lat1, lng1, lat2, lng2);
            }
            
        }

        var closestDist = Math.min(...Object.values(userDist));        
        
        for(key in userDist)
        {
            if(userDist[key] == closestDist)
            {
                distances[user.id] = key;
            }
        }

    }

    return distances;
}

function findUser(userid, users)
{
    for(user of users)
    {
        if(user.id == userid)
        {
            return user;
        }
    }

}

function countDistance(lat1, lng1, lat2, lng2)
{
    var radius = 6371;
    var latDiff = (lat2 - lat1) * (Math.PI/180);
    var lngDiff = (lng2 - lng1) * (Math.PI/180);

    var h =  Math.sin(latDiff/2) * Math.sin(latDiff/2) + Math.cos((Math.PI/180)*(lat1)) * Math.cos((Math.PI/180)*(lat2)) * Math.sin(lngDiff/2) * Math.sin(lngDiff/2);
    var h2 = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h)); 
    var d = radius * h2;
    return d;
}
  

async function main()
{
    var users = await getData('https://jsonplaceholder.typicode.com/users');
    var posts = await getData('https://jsonplaceholder.typicode.com/posts');
    var counted = countPosts(posts, users);
    document.getElementById('task1').innerHTML = '<h2>Liczba postów</h2>';
    document.getElementById('task1').innerHTML += counted;

    document.getElementById('task2').innerHTML = repeatPost(posts);


    var distance = getDistances(users); 
    document.getElementById('task3').innerHTML = '<h2>Sąsiedzi</h2>';
    for(key in distance)
    {
        var user1 = findUser(key, users);
        var user2 = findUser(distance[key], users);
        document.getElementById('task3').innerHTML += `Najbliższym sąsiadem ${user1.username} jest ${user.username}<br>`;
    }

    var p = listOfPosts(users, posts);
    document.getElementById('task4').innerHTML = p;


}

async function tests()
{
    //zmienione dane testowe (ad blocker w przegladarce moze uniemozliwic odczytywanie)
    var users = await getData('https://my-json-server.typicode.com/kingapyrek/OpenX/users');
    var posts = await getData('https://my-json-server.typicode.com/kingapyrek/OpenX/posts');

    //countPosts test 
    var test1Expected = 'Adam napisal(a) 2 postow.<br>Antonette napisal(a) 1 postow.<br>'
    +'Samantha napisal(a) 2 postow.<br>Karianne napisal(a) 1 postow.<br>Kamren napisal(a) 2 postow.'
    +'<br>Leopoldo_Corkery napisal(a) 1 postow.<br>Elwyn.Skiles napisal(a) 3 postow.<br>';

    if(countPosts(posts, users) == test1Expected)
    {
        console.log('test 1 -Funkcja countPosts - ok');
    }
    else
    {
        console.log('Funkcja countPost nie zwróciła poprawnego wyniku');
    }

    //titles test
    var test2Expected = 'title1<br>title2<br>';
    if(repeatPost(posts) == test2Expected)
    {
        console.log('test2 Funkcja repeatPost - ok');
    }
    else
    {
        console.log('Funkcja reapeatPost nie zwróciła poprawnego wyniku');
    }

    //distances - użytkownik o indeksie 1 i 2 mają takie same współrzędne, więc są najbliższymi sąsiadami
    var res = getDistances(users);
    if(res[1] == 2 && res[2] == 1)
    {
        console.log('test 3 - Funkcja getDistances - ok');
    }
    else
    {
        console.log('Funkcja getDistances nie zwróciła poprawnego wyniku');
    }

    
}

async function showNumberPosts()
{
    document.getElementById('task1').style.display = 'block';
    document.getElementById('task2').style.display = 'none';
    document.getElementById('task3').style.display = 'none';
    document.getElementById('task4').style.display = 'none';
    document.getElementById('start').style.display = 'none';
}

async function showNotUniquePosts(posts)
{
    document.getElementById('task2').style.display = 'block';
    document.getElementById('task1').style.display = 'none';
    document.getElementById('task3').style.display = 'none';
    document.getElementById('task4').style.display = 'none';
    document.getElementById('start').style.display = 'none';
}

async function showNeighbor()
{
    document.getElementById('task3').style.display = 'block';
    document.getElementById('task1').style.display = 'none';
    document.getElementById('task2').style.display = 'none';
    document.getElementById('task4').style.display = 'none';
    document.getElementById('start').style.display = 'none';
}

function showPosts()
{
    document.getElementById('task4').style.display = 'block';
    document.getElementById('task1').style.display = 'none';
    document.getElementById('task2').style.display = 'none';
    document.getElementById('task3').style.display = 'none';
    document.getElementById('start').style.display = 'none';
}

window.onload = main;