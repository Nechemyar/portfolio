# iOS 26 Safari chrome over a phone tile: status bar, glass bottom bar
SIG='<svg viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="5" y="5.5" width="3" height="6.5" rx=".7"/><rect x="10" y="3" width="3" height="9" rx=".7"/><rect x="15" y="0" width="3" height="12" rx=".7"/></svg>'
WIFI='<svg viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.1-1.1A10 10 0 0 0 8 1 10 10 0 0 0 .9 3.9L2 5a8.6 8.6 0 0 1 6-2.4z"/><path d="M8 6c1.4 0 2.6.5 3.6 1.4l1.1-1.1A6.8 6.8 0 0 0 8 4.4c-1.8 0-3.5.7-4.7 1.9l1.1 1.1C5.4 6.5 6.6 6 8 6z"/><path d="M8 9.3c.6 0 1.1.2 1.5.6L8 11.5 6.5 9.9c.4-.4.9-.6 1.5-.6z"/></svg>'
BAT='<svg class="ios__bat" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.6" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" fill="currentColor" opacity=".45"/></svg>'
BACK='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 3.5 6 10l6.5 6.5"/></svg>'
PAGE='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="3.5" width="14" height="13" rx="3"/><path d="M6.5 8h7M6.5 11h7M6.5 14h4"/></svg>'
RELOAD='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 10a5.5 5.5 0 1 1-1.8-4.1"/><path d="M14.2 2.8v3.5h-3.5"/></svg>'
MORE='<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4.5" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="15.5" cy="10" r="1.6"/></svg>'
SITE={'choice':('#343231','#fff','choiceinventory.co.uk'),'clinical':('#ffffff','#000','clinicalassessments.co.uk'),'jsense':('#a13e78','#fff','jsense.org.uk')}
def ios(clip):
    sb,ink,host=SITE[clip.split('-')[0]]
    chrome=(f'<div class="ios" aria-hidden="true"><div class="ios__sb"><span class="ios__time">9:41</span><span class="ios__icons">{SIG}{WIFI}{BAT}</span></div>'
            f'<div class="ios__bar"><span class="ios__glass ios__btn">{BACK}</span><span class="ios__glass ios__addr">{PAGE}<span>{host}</span>{RELOAD}</span><span class="ios__glass ios__btn">{MORE}</span></div><span class="ios__home"></span></div>')
    return f' style="--sb:{sb};--sb-ink:{ink}"', chrome
