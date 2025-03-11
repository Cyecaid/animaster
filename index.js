addListeners();

let STOP;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 1000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            STOP = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (STOP) {
                STOP.stop();
            }
        });


}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide(element, duration) {
            element.style.transitionDuration = `${duration * 2.0 / 5}ms`;
            element.style.transform = getTransform({x: 100, y: 20}, null);
            setTimeout(animaster().fadeOut, duration * 2.0 / 5, element, duration * 3 / 5);
        },
        heartBeating(element) {
            let scaleUp = true;
            let a = 1;

            function animateScale() {
                if (scaleUp) {
                    animaster().scale(element, 500, a);
                } else {
                    animaster().scale(element, 500, 1);
                    a = 1;
                }
                scaleUp = !scaleUp;
                a += 0.05;
            }

            const intervalId = setInterval(animateScale, 500);
            return {
                stop: () => {
                    clearInterval(intervalId);
                    animaster().scale(element, 500, 1);
                }
            };
        },
        showAndHide(element, duration) {
            animaster().fadeIn(element, duration * 1 / 3);
            setTimeout(animaster().fadeOut, duration * 1 / 3, element, duration * 1 / 3);
        },
    }
}
