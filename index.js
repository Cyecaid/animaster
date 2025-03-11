addListeners();

let STOP = null;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().reset(block, 'fadeIn');
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().reset(block, 'move');
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().reset(block, 'scale');
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 1000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().reset(block, 'fadeOut');
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().reset(block, 'moveAndHide');
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

    document.getElementById('11')
        .addEventListener('click', function () {
            if (STOP) {
                STOP.stop();
            }
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
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
        _steps: [],

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
            this.addMove(duration, translation).play(element);
        },

        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },

        moveAndHide(element, duration) {
            this.addMove(duration * 2.0 / 5, { x: 100, y: 20 })
                .addFadeOut(duration * 3.0 / 5)
                .play(element);
        },

        showAndHide(element, duration) {
            this.addFadeIn(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            let scaleUp = true;
            function animateScale() {
                if (scaleUp) {
                    animaster().scale(element, 500, 1.4);
                } else {
                    animaster().scale(element, 500, 1);
                }
                scaleUp = !scaleUp;
            }
            const intervalId = setInterval(animateScale, 500);
            return {
                stop: () => {
                    clearInterval(intervalId);
                    animaster().scale(element, 500, 1);
                    STOP = null;
                }
            };
        },

        reset(element, animationType) {
            element.style.transitionDuration = null;
            element.style.transform = null;
            if (animationType === 'fadeIn') {
                element.classList.add('hide');
                element.classList.remove('show');
            } else if (animationType === 'fadeOut') {
                element.classList.remove('hide');
                element.classList.add('show');
            }
        },

        addMove(duration, translation) {
            this._steps.push({ type: 'move', duration, translation });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({ type: 'scale', duration, ratio });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({ type: 'fadeIn', duration });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({ type: 'fadeOut', duration });
            return this;
        },

        play(element) {
            let delay = 0;
            this._steps.forEach(step => {
                setTimeout(() => {
                    if (step.type === 'move') {
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.style.transform = getTransform(step.translation, null);
                    } else if (step.type === 'scale') {
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.style.transform = getTransform(null, step.ratio);
                    } else if (step.type === 'fadeIn') {
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.classList.remove('hide');
                        element.classList.add('show');
                    } else if (step.type === 'fadeOut') {
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                    }
                }, delay);
                delay += step.duration;
            });
        }
    };
}
