document.querySelector('.menu').addEventListener('mouseenter', () => {
    document.querySelector('.menu__list').style.display = 'block'
    document.querySelector('.menu').style.height = '100%'
})


// Event for burger button 
document.querySelector('.menu__burger-symbols').addEventListener('click', () => {
    document.querySelector('.menu__list').style.display = 'block'
    document.querySelector('.menu').style.height = '100%'
    document.querySelector('.menu').style.minWidth = '250px'
    setTimeout(() => {
        document.querySelectorAll('.menu__list-text').forEach(item => item.style.display = 'inline-block')
    }, 200)
    document.querySelector('.menu__burger-symbols').style.display = 'none'
    document.querySelector('.menu__burger-close').style.display = 'inline-block'
    document.querySelector('.menu__burger').style.alignItems = 'flex-start'
})


// Events for List
document.querySelector('.menu__list').addEventListener('mouseenter', () => {
    document.querySelector('.menu').style.minWidth = '250px'
    setTimeout(() => {
        document.querySelectorAll('.menu__list-text').forEach(item => item.style.display = 'inline-block')
    }, 150)
    document.querySelector('.menu__burger-symbols').style.display = 'none'
    document.querySelector('.menu__burger-close').style.display = 'inline-block'
    document.querySelector('.menu__burger').style.alignItems = 'flex-start'
})


// Event for btn close
document.querySelector('.menu__burger-close').addEventListener('click', () => {
    document.querySelector('.menu').style.minWidth = '60px'
    document.querySelectorAll('.menu__list-text').forEach(item => item.style.display = 'none')
    document.querySelector('.menu__burger-symbols').style.display = 'block'
    document.querySelector('.menu__burger').style.alignItems = 'center'
    document.querySelector('.menu__burger-close').style.display = 'none'
    document.querySelector('.menu__list').style.display = 'none'
    document.querySelector('.menu').style.height = 'auto'
    document.querySelector('.menu__list-item-reports').style.display = 'none' 
})

document.querySelector('.menu__reports').addEventListener('click', () => {
    const status = document.querySelector('.menu__list-item-reports');

    if (status.offsetWidth) {
        document.querySelector('.menu__list-item-reports').style.display = 'none' 
    } else {
        document.querySelector('.menu__list-item-reports').style.display = 'block'
    }
    
})