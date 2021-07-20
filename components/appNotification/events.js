export default function Events() {
  const touchEnd = (name, evt) => {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    if (this.isSpringing) {
      return;
    }

    const exiting = this.slideDirection == "up" && this.dragDy <= -65;

    // const exiting = false;

    const revert = () => {
      this.transform = `${this.dragDy}%`;

      this.touchActive = false;
    };

    requestAnimationFrame(() => {
      if (exiting) {
        this.transitionDuration = 200;

        this.dragDy = -120;

        revert();
      } else {
        console.log(this.dragDy);
        !this.isSpringing &&
          this.worker.postMessage({
            name: "spring",
            component: `appNotification_${this._uid}`,
            from: `${this.dragDy}%`,
            to: "0%",
            precision: 0.01,
            stiffness: this.stiffness * ((this.dragDy / 75) * 2),
            mass: 1,
            damping: 15,
            cssText: "transform: translate3d(-50%, {0}, 0px)",
          });
        this.touchActive = false;
      }
      this.transitionDuration = exiting ? 200 : 0;
      this.currentTouchEvent = `touch${name}`;
    });
  };
  let returnValue = {
    touchstart: (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.touchActive = true;
      this.mouseY = e.touches[0].clientY;
      this.currentTouchEvent = "touchstart";
      this.transitionDuration = 0;
    },
    "!touchend": (e) => {
      touchEnd("end", e);
    },
    "!touchcancel": (e) => {
      touchEnd("cancel", e);
    },
  };

  if (this.touchActive) {
    returnValue = {
      ...returnValue,

      "&touchmove": (e) => {
        e.stopPropagation();

        if (
          !this.touchActive ||
          /touchend|touchcancel/i.test(this.currentTouchEvent)
        ) {
          return;
        }

        requestAnimationFrame(() => {
          this.currentTouchEvent = "touchmove";

          const clientY = e.touches[0].clientY;

          this.dy = clientY - this.mouseY;

          if (this.mouseY > clientY) {
            this.slideDirection = "up";
          } else {
            this.slideDirection = "down";
          }

          this.dragDy = this.dragDy + this.dy;
          this.mouseY = clientY;

          if (this.dragDy >= 75) {
            this.dragDy = 75;
            // touchEnd("cancel");
            return;
          }

          this.transform = `${this.dragDy}%`;
        });
      },
    };
  }

  return returnValue;
}
