// ScriptSafe - Copyright (C) andryou
// Distributed under the terms of the GNU General Public License
// The GNU General Public License can be found in the gpl.txt file. Alternatively, see <http://www.gnu.org/licenses/>.
var bkg = chrome.extension.getBackgroundPage();
var fakeLocalStorage = {}

// Really hacky workaround to make async sync
var lekelStorage = new Proxy({},
	{
		get(target, prop) {
			return fakeLocalStorage[prop];
		},
		set(target, prop, val) {
			fakeLocalStorage[prop] = val;
			let toSet = {}
			toSet[prop] = val;
			bkg.browser.storage.local.set(toSet);
			return true;
		}
	}
)
function refreshFromStorage(changes, area) {
	if (area != "local") return
	bkg.browser.storage.local.get(null).then((res) => {
		for (let key in res) {
			fakeLocalStorage[key] = res[key];
		}
	});
}
browser.storage.onChanged.addListener(refreshFromStorage);
refreshFromStorage();
document.addEventListener('DOMContentLoaded', function () {
	var version = '1.0.9.2';
	$("#title").html("ScriptSafe v"+version+" DEVELOPMENT");
	$('#versionno').html(version);
	$("#loadoptionspage").click(function() { location.href='options.html'; });
	$("#closepage").click(function() { window.open('', '_self', '');window.close(); });
	$("#disableNotification").click(disableNotification);
	$("#loadoptionspage").val(bkg.getLocale("options"));
	$(".i18_options").html(bkg.getLocale("options"));
	$(".i18_support").html(bkg.getLocale("support"));
	$("#closepage").val(bkg.getLocale("close"));
	$("#disableNotification").val(bkg.getLocale("dontshowpage"));
});
function disableNotification() {
	if (confirm(bkg.getLocale("updatedisable"))) {
		lekelStorage['updatenotify'] = 'false';
		$('#message').html(bkg.getLocale("updatedisablemessage")).stop().fadeIn("slow").delay(2000).fadeOut("slow");
	}
}