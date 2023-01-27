import { gsap } from 'gsap'

let api = 'https://google.com';
$('a[href^="#"]').on("click", function(e){
    let anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr("href")).offset().top
    }, 1000);
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function(){
    gsap.registerPlugin(ScrollTrigger) // добавление плагина для gsap
    document.querySelector('.main').classList.add('played')

    if(document.querySelector('.feedback') !==null){
        $('.feedback-slider').slick({
            prevArrow: '.left_arrow',
            nextArrow: '.right_arrow',
            autoplay: {
                delay: 8000,
            }
        })
    }

    const button = document.querySelector('.content__button')
    button.addEventListener('mouseover', function(e) {
        let size = Math.max(this.offsetWidth, this.offsetHeight),
            x = e.offsetX - size / 2,
            y = e.offsetY - size / 2,
            wave = this.querySelector('.wave')

        if (!wave) {
            wave = document.createElement('span')
            wave.className = 'wave'
        }
        wave.style.cssText = `width:${size}px;height:${size}px;top:${y}px;left:${x}px`
        this.appendChild(wave)
    })

    const social_icons = document.querySelectorAll('.content-social__item')

    social_icons.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            el.style.transition = `.0s`
            el.style.transform = `translate(${e.offsetX / 8}px, ${e.offsetY / 8}px)`
        })
    })
    social_icons.forEach(el => {
        el.addEventListener('mouseout', (e) => {
            console.log(e.offsetX)
            el.style.transition = `.3s`
            el.style.transform = `translate(0px, 0px)`
        })
    })

    //анимация пунктов в блоке menu
    let menu_item_tl = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: '.menu',
            start: '-70% top',
            // markers: true,
        }
    });
    menu_item_tl.from('.menu-list__item', {x: -30, opacity: 0, stagger: 0.3, duration: .4})

    //анимация картинок в блоке menu
    gsap.from('.menu-imgBx__left', { //левая картинка
        scrollTrigger: {
            trigger: '.menu',
            start: '-70% top',
            // markers: true,
        },
        x: -30,
        opacity: 0,
        duration: 1
    })
    gsap.from('.menu-imgBx__right', { //правая картинка
        scrollTrigger: {
            trigger: '.menu',
            start: '-70% top',
            // markers: true,
        },
        x: 30,
        opacity: 0,
        duration: 1
    })

    //mobile menu
    let burger_button = document.querySelector('.header-burger'),
        nav = document.querySelector('.header-nav'),
        nav_links = nav.querySelector('a'),
        blackout = document.querySelector('.blackout')

    burger_button.addEventListener('click', () => {
        toggle_menu()
    })
    blackout.addEventListener('click', () => {
        toggle_menu()

        let modal = document.querySelector('.modal')
        block_toggle(modal)
    })
    nav_links.addEventListener('click', () => {
        toggle_menu()
    })

    //form
    let modal = document.querySelector('.modal'),
        modal_form = modal.querySelector('form'),
        content_button = document.querySelector('.content__button')

    content_button.addEventListener('click', () => {
        modal.classList.add('active')
        blackout.classList.add('show')
    })

    //submit формы
    modal_form.addEventListener('submit', e => {
        e.preventDefault()
        sendRequest('GET', 'test', $('.modal form').serialize(), true, json => {
            try {
                console.log(json.message)
            }catch (err){
                alert('ошибка при запросе, неправильно указан url')
            }
        })
    })
});

let toggle_menu = () => {
    let nav = document.querySelector('.header-nav'),
        blackout = document.querySelector('.blackout')
    if(nav.classList.contains('active')){
        nav.classList.remove('active')
        blackout.classList.remove('show')
    }else{
        nav.classList.add('active')
        blackout.classList.add('show')
    }
}

let block_toggle = (block) => {
    let blackout = document.querySelector('.blackout')
    if(block){
        if(block.classList.contains('active')){
            block.classList.remove('active')
            blackout.classList.remove('show')
        }
    }
}
let sendRequest = (type = 'POST', link, data, processData = true, callback = json => {}) => {
    $.ajax({
        type: type,
        url: `${api}/${link}`,
        data: data ? data : '',
        dataType: "json",
        processData: processData,
        headers: {
            "Authorization": "Bearer " + localStorage.token
        },
        success: function (response) {
            callback(response);
        },
    });
}
let start_diff_timer = ($days = null, $hours = null, $minutes = null, $seconds = null, difference = 5, last_seconds = 59, local_host_name, $days_text = null, $hours_text = null, $minutes_text = null, $seconds_text = null) => {
    // конечная дата, например 1 июля 2021
    let deadline;
    let timerId = null;
    let interval_5_seconds = null;

    if((new Date().getDate() > new Date(localStorage.getItem(local_host_name)).getDate()) || new Date().getMonth() > new Date(localStorage.getItem(local_host_name)).getMonth() ){
        clearInterval(interval_5_seconds)
        interval_5_seconds = null
        localStorage.removeItem(local_host_name)
    }
    if(localStorage.getItem(local_host_name)){
        deadline = new Date(localStorage.getItem(local_host_name))
    }else{
        deadline = new Date();
        deadline.setMinutes(deadline.getMinutes() + difference)
        if(deadline.getMinutes() > 59){
            deadline.setMinutes(deadline.getMinutes() - 59)
        }
        localStorage.setItem(local_host_name, deadline)
    }
    // склонение числительных
    function declensionNum(num, words) {
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }
    function initializeClock(){
        if(!$seconds) return false
        let second = last_seconds
        if(!interval_5_seconds){
            interval_5_seconds = setInterval(() => {
                if(second < 0) second = last_seconds
                $seconds.forEach(el => {
                    el.textContent = second < 10 ? '0' + second : second
                })
                second -= 1
            }, 1000)
        }
    }
    // вычисляем разницу дат и устанавливаем оставшееся времени в качестве содержимого элементов
    function countdownTimer() {
        const diff = deadline - new Date();
        if (diff <= 0) {
            clearInterval(timerId);
            initializeClock()
        }
        const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0
        const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0
        const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0
        const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0

        if($days) $days.forEach(el => {el.textContent = days < 10 ? '0' + days : days})
        if($hours) $hours.forEach(el => {el.textContent = hours < 10 ? '0' + hours : hours})
        if($minutes) $minutes.forEach(el => {el.textContent = minutes < 10 ? '0' + minutes : minutes})
        if($seconds) $seconds.forEach(el => {el.textContent = seconds < 10 ? '0' + seconds : seconds})

        if($days_text) $days_text.textContent = declensionNum(days, ['день', 'дня', 'дней'])
        if($hours_text) $hours_text.textContent = declensionNum(days, ['час', 'часа', 'часов'])
        if($minutes_text) $minutes_text.textContent = declensionNum(days, ['минута', 'минуты', 'минут'])
        if($seconds_text) $seconds_text.textContent = declensionNum(days, ['секунда', 'секунды', 'секунд'])
    }
    // вызываем функцию countdownTimer
    countdownTimer();
    // вызываем функцию countdownTimer каждую секунду
    timerId = setInterval(countdownTimer, 1000);
}