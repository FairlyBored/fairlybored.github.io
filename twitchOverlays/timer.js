document.addEventListener('DOMContentLoaded', (event) => {
	const urlParams = new URLSearchParams(window.location.search);
	const channel = urlParams.get('channel');
	if(channel == null)
	{
		document.body.innerHTML = '<div id="error">No channel provided. Please use url ' + window.location.href.split('?')[0] + '?channel=yourchannelhere</div>';
		return;
	}

	ComfyJS.onCommand = (user, command, message, flags, extra) => {
		if((flags.broadcaster || flags.mod) && command === "timer")
		{
			if(typeof(document.getElementById('flip-clock')) == 'undefined' || document.getElementById('flip-clock') == null)
			{
				const regexp = /((([0-9]{1,4})([dhms]{1})))/g;
				const totalTime = getTotalTime(message.match(regexp));
				var deadline = new Date(Date.parse(new Date()) + totalTime * 1000);
				var c = new Clock(deadline, function () {
					// play sound
				});
				document.body.appendChild(c.el);
			}
		}
		else if((flags.broadcaster || flags.mod) && command === "timerstop")
		{
			// 
		}
		else if((flags.broadcaster || flags.mod) && command === "timerpause")
		{
			//
		}
		else if((flags.broadcaster || flags.mod) && command === "timerresume")
		{
			//
		}
		else if((flags.broadcaster || flags.mod) && command === "timerremove")
		{
			document.getElementsByTagName('body')[0].innerHTML = '';
		}
		else if ((flags.broadcaster || flags.mod) && command === 'timeralerttest')
		{
			//
		}
		else if ((flags.broadcaster || flags.mod) && command === 'timerreload')
		{
			window.location.reload();
		}
	}
	ComfyJS.Init(channel);


	// Countdown from https://codepen.io/shshaw/pen/vKzoLL/
	function CountdownTracker(label, value)
	{
		var el = document.createElement("span");
	
		el.className = "flip-clock__piece";
		el.innerHTML = `
			<span class="flip-clock__card card">
				<span class="card__top"></span>
				<span class="card__bottom"></span>
				<span class="card__back">
					<span class="card__bottom"></span>
				</span>
			</span>
			<span class="flip-clock__slot"></span>`;
	
		this.el = el;
	
		var top = el.querySelector(".card__top"),
			bottom = el.querySelector(".card__bottom"),
			back = el.querySelector(".card__back"),
			backBottom = el.querySelector(".card__back .card__bottom");
	
		this.update = function (val)
		{
			val = ("0" + val).slice(-2);
			if (val !== this.currentValue)
			{
				if (this.currentValue >= 0)
				{
					back.setAttribute("data-value", this.currentValue);
					bottom.setAttribute("data-value", this.currentValue);
				}
				this.currentValue = val;
				top.innerText = this.currentValue;
				backBottom.setAttribute("data-value", this.currentValue);
	
				this.el.classList.remove("flip");
				void this.el.offsetWidth;
				this.el.classList.add("flip");
			}
		};
	
		this.update(value);
	}
	
	// Calculation adapted from https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
	
	function getTimeRemaining(endtime)
	{
		var t = Date.parse(endtime) - Date.parse(new Date());
		return {
			Total: t,
			Days: Math.floor(t / (1000 * 60 * 60 * 24)),
			Hours: Math.floor((t / (1000 * 60 * 60)) % 24),
			Minutes: Math.floor((t / 1000 / 60) % 60),
			Seconds: Math.floor((t / 1000) % 60)
		};
	}
	
	function getTime()
	{
		var t = new Date();
		return {
			Total: t,
			Hours: t.getHours() % 12,
			Minutes: t.getMinutes(),
			Seconds: t.getSeconds()
		};
	}
	
	function Clock(countdown, callback)
	{
		countdown = countdown ? new Date(Date.parse(countdown)) : false;
		callback = callback || function () {};
	
		var updateFn = countdown ? getTimeRemaining : getTime;
	
		this.el = document.createElement("div");
		this.el.id = "flip-clock";
	
		var trackers = {},
			t = updateFn(countdown),
			key,
			timeinterval;
	
		for (key in t)
		{
			if (key === "Total")
			{
				continue;
			}
			trackers[key] = new CountdownTracker(key, t[key]);
			this.el.appendChild(trackers[key].el);
		}
	
		var i = 0;
		function updateClock()
		{
			timeinterval = requestAnimationFrame(updateClock);
	
			// throttle so it's not constantly updating the time.
			if (i++ % 10) {
				return;
			}
	
			var t = updateFn(countdown);
			if (t.Total < 0)
			{
				cancelAnimationFrame(timeinterval);
				for (key in trackers)
				{
					trackers[key].update(0);
				}
				callback();
				return;
			}
	
			for (key in trackers)
			{
				trackers[key].update(t[key]);
			}
		}
	
		setTimeout(updateClock, 500);
	}
	function getTotalTime(matches)
	{
		let total = 0;
		for (const match of matches)
		{
			if(match.search('d') != -1)
			{
				total = total+(parseInt(match)*24*60*60);
			}
			else if(match.search('h') != -1)
			{
				total = total+(parseInt(match)*60*60);
			}
			else if(match.search('m') != -1)
			{
				total = total+(parseInt(match)*60);
			}
			else if(match.search('s') != -1)
			{
				total = total+parseInt(match);
			}
		}
		return total;
	}

	//var clock = new Clock();
	//document.body.appendChild(clock.el);
});