'use strict';

const AppError = require('../error/AppError');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const multer = require('multer');

let FWUP_DIR = '/tmp';
let FWUP_TAR = 'kernel_upgrade.tar';
/*
const storage4kernel = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FWUP_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, FWUP_TAR);
    }
});
*/
const upload_kernel = multer({ dest: '/tmp' });
//const upload_kernel = multer({ storage: storage4kernel });
const dbService = require('../service/db');
const logger = require('../util/logger');
//const errorRouteHandler = require('../error/routeHandler');
//const convertUtil = require('../util/convert');
//const _ = require('lodash');

const os = require('os');
var fs = require('fs');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var execFileSync = require('child_process').execFileSync;
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;

// sysinfo skeleton
var wntsysinfo = {
  system: {
    hostname: '',
    modelname: '',
    uptime: {
      day: 0,
      hr: 0,
      min: 0,
      sec: 0
    },
    kernel: {
      krelease: '',
      kgitcmt: '',
      uts_ver: '',
      uts_rel: ''
    },
    localtime: '',
    cpu: {},
    mem: {
      total: 0,
      used: 0,
      free: 0,
      cached: 0
    },
    nand: {}
  },
  network: {
    netMode: '',
    wan: {
      ip: '',
      netmask: '',
      mac: '',
      defgw: ''
    },
    lan: {
      ip: '',
      netmask: '',
      mac: ''
    },
    dns: []
  },
  fwinfo: {
    version: ''
  }
};

let WNTSYSCONF_PATH = '/etc/wntsysconf.json';

function netmask2subnet(netmask) {
  var subnet = [0, 0, 0, 0];
  var i,
    n = 0;
  for (i = 0; i < 32; i++) {
    n = Math.floor(i / 8);
    subnet[n] = subnet[n] << 1;
    if (i < netmask) subnet[n] += 1;
  }
  return subnet.join('.');
}

function read_resolv_conf() {
  var child = spawnSync('/bin/sed', [
    '-ne',
    's/^nameserver *\\([1-9][0-9]*\\.[0-9]*\\.[0-9]*\\.[0-9]*\\).*$/\\1/p',
    '/etc/resolv.conf'
  ]);
  return child.stdout
    .toString()
    .split('\n')
    .filter((dns) => {
      return dns.trim().length > 0;
    });
}

function get_file_size(filepath) {
  const stats = fs.statSync(filepath);
  const file_size = stats.size;
  return file_size;
}

function getModelName() {
  if (fs.existsSync('/etc/dtype_datalogger')) {
    return 'LSIS SmartLV Data Logger';
  } else if (fs.existsSync('/etc/dtype_gateway')) {
    return 'LSIS SmartLV Gateway';
  } else {
    return 'LSIS SmartLV';
  }
}

function getUptime() {
  var uptime = {
    day: 0,
    hr: 0,
    min: 0,
    sec: 0
  };
  var totsec = os.uptime();
  var remainsec = 0;

  uptime.day = Math.round(totsec / (3600 * 24), 0);
  remainsec = totsec % (3600 * 24);
  uptime.hr = Math.round(remainsec / 3600, 0);
  remainsec %= 3600;
  uptime.min = Math.round(remainsec / 60, 0);
  uptime.sec = remainsec % 60;

  return uptime;
}

function getLocalTime() {
  var child = spawnSync('/bin/date');
  return child.stdout.toString().trim();
}

function getMemUsage() {
  var mem = {
    total: 0,
    used: 0,
    free: 0,
    cached: 0
  };
  var child = spawnSync('/usr/bin/free', ['-m']);
  const lines = child.stdout.toString().split('\n');
  var i;
  for (i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length == 0) break;

    const vals = line.split(' ').filter((entry) => {
      return entry.trim().length > 0;
    });

    if (vals[0].trim() === 'Mem:') {
      mem.total = Math.round(vals[1].trim(), 0);
      mem.used = Math.round(vals[2].trim(), 0);
      mem.free = Math.round(vals[3].trim(), 0);
      mem.cached = Math.round(vals[6].trim(), 0);

      break;
    }
  }
  return mem;
}

function getDefaultGw() {
  var child = spawnSync('/sbin/route', ['-n']);
  var routes = child.stdout.toString().split('\n');
  var defgw = '';
  routes.forEach((entry) => {
    if (entry.startsWith('0.0.0.0')) {
      var cols = entry.split(' ').filter((item) => {
        return item.trim().length > 0;
      });
      defgw = cols[1];
    }
  });
  return defgw;
}

function getNetStatus(sysconf) {
  var netStatus = new Object();
  netStatus.wan = new Object();
  netStatus.wan.linkup = false;
  netStatus.lan = new Object();
  netStatus.lan.linkup = false;

  const netifs = os.networkInterfaces();
  if (sysconf.network.netmode === 'nat') {
    netStatus.netMode = 'nat';
    // WAN Status
    if (sysconf.network.wlan.mode === 'station') {
      if (typeof netifs['wlan0'] !== 'undefined') {
        netStatus.wan.linkup = true;
        netifs['wlan0'].forEach((entry) => {
          if (entry.family === 'IPv4') {
            netStatus.wan.proto = sysconf.network.wan.proto;
            netStatus.wan.ip = entry.address;
            netStatus.wan.netmask = entry.netmask;
            netStatus.wan.mac = entry.mac;
          }
        });
        netStatus.wan.defgw = getDefaultGw();
      }
    } else {
      if (typeof netifs['br-wan'] !== 'undefined') {
        netStatus.wan.linkup = true;
        netifs['br-wan'].forEach((entry) => {
          if (entry.family === 'IPv4') {
            netStatus.wan.proto = sysconf.network.wan.proto;
            netStatus.wan.ip = entry.address;
            netStatus.wan.netmask = entry.netmask;
            netStatus.wan.mac = entry.mac;
          }
        });
        netStatus.wan.defgw = getDefaultGw();
      }
    }

    // LAN Status
    if (typeof netifs['br-lan'] !== 'undefined') {
      netStatus.lan.linkup = true;
      netifs['br-lan'].forEach((entry) => {
        if (entry.family === 'IPv4') {
          netStatus.lan.proto = 'static';
          netStatus.lan.ip = entry.address;
          netStatus.lan.netmask = entry.netmask;
          netStatus.lan.mac = entry.mac;
        }
      });
    }
  } else {
    netStatus.netMode = 'bridge';
    if (typeof netifs['br-wan'] !== 'undefined') {
      netStatus.wan.linkup = true;
      netifs['br-wan'].forEach((entry) => {
        if (entry.family === 'IPv4') {
          netStatus.wan.ip = entry.address;
          netStatus.wan.netmask = entry.netmask;
          netStatus.wan.mac = entry.mac;
        }
      });
      netStatus.wan.defgw = getDefaultGw();
    }
  }

  var dns = read_resolv_conf();
  if (dns.length > 0) netStatus.dns = dns;

  return netStatus;
}

function getSysConf() {
  try {
    var text = fs.readFileSync('/etc/wntsysconf.json', 'utf8');
    var sysconf = JSON.parse(text);
    return sysconf;
  } catch (e) {
    return null;
  }
}

// get system configuration
router.get('/wntSysConf', function (req, res) {
  fs.readFile(WNTSYSCONF_PATH, 'utf8', (err, data) => {
    if (err)
      throw new AppError('Failed to read the System Config File', [err], 500);

    try {
      var wntsysconf = JSON.parse(data);
      if (!wntsysconf.network.configured) {
        wntsysconf.network.configured = true;
        try {
          fs.writeFileSync(
            WNTSYSCONF_PATH,
            JSON.stringify(wntsysconf, undefined, 2)
          );
        } catch (e) {
          throw e;
        }
      }
      res.send(wntsysconf);
    } catch (e) {
      throw new AppError('Unknown System Error', [e], 500);
    }
  });
});

router.get('/wntSysInfo', function (req, res) {
  try {
    wntsysinfo.system.hostname = os.hostname();
    wntsysinfo.system.modelname = getModelName();
    wntsysinfo.system.kernel = getCurKernVer();
    wntsysinfo.system.uptime = getUptime();
    wntsysinfo.system.localtime = getLocalTime();
    wntsysinfo.system.mem = getMemUsage();

    var text = fs.readFileSync(WNTSYSCONF_PATH, 'utf8');
    var sysconf = JSON.parse(text);
    wntsysinfo.network = getNetStatus(sysconf);

    res.send(wntsysinfo);
  } catch (e) {
    throw new AppError('Unknown System Error', [e, wntsysinfo], 500);
  }
});

router.get('/timezones', function (req, res) {
  var result = '';
  var timedatectl = spawn('/usr/bin/timedatectl', ['list-timezones']);
  timedatectl.stdout.on('data', (data) => {
    result += data.toString();
  });
  timedatectl.on('close', function (code) {
    if (code == 0) {
      var tzs = new Array();
      var tzlist = result.split('\n');
      var tz;

      if (tzlist.indexOf('Asia/Seoul') < 0) {
        tzlist.push('Asia/Seoul');
        tzlist.sort();
      }

      while ((tz = tzlist.shift())) {
        if (tz.length > 0) {
          if (tz === 'Asia/Seoul') tzs.push({ value: 'ROK', text: tz });
          else tzs.push({ value: tz, text: tz });
        }
      }

      res.send(tzs);
    } else {
      return Promise.reject(new AppError('timedatectl failed'));
    }
  });
});

router.post('/setWan', function (req, res) {
  fs.readFile(WNTSYSCONF_PATH, 'utf8', (err, data) => {
    if (err) throw new AppError('file not found', [err], 404);

    try {
      var changed = false;
      var wntsysconf = JSON.parse(data);

      //console.log(req.body);

      if (
        wntsysconf.network.netmode != req.body.netmode ||
        wntsysconf.network.wan.proto != req.body.wan.proto ||
        wntsysconf.network.wan.ipaddr != req.body.wan.ipaddr ||
        wntsysconf.network.wan.netmask != req.body.wan.netmask ||
        wntsysconf.network.wan.defgw != req.body.wan.netmask ||
        wntsysconf.network.wan.dns.mode != req.body.wan.dns.mode ||
        wntsysconf.network.wan.dns.primary != req.body.wan.dns.primary ||
        wntsysconf.network.wan.dns.secondary != req.body.wan.dns.secondary
      ) {
        changed = true;
      }

      if (changed) {
        var isWlWan = wntsysconf.network.wlan.mode === 'station';
        var ifwan = isWlWan ? 'wlan0' : 'br-wan';
        if (isWlWan && req.body.netmode !== 'nat') {
          console.log('netmode=' + req.body.netmode + ', wifimode=station');
          throw new AppError(
            'Bridge node impossible when wifi mode is station.',
            [e],
            403
          );
        }
        var wan = fs.createWriteStream(
          '/etc/systemd/network/' +
            (isWlWan ? '30-wlan.network' : 'br-wan.network')
        );
        wan.write('[Match]\n');
        wan.write('Name=' + ifwan + '\n\n');
        wan.write('[Network]\n');
        if (req.body.wan.proto === 'dhcp') {
          wan.write('DHCP=ipv4\n');
          if (req.body.wan.dns.mode !== 'auto') {
            if (req.body.wan.dns.primary && req.body.wan.dns.primary.length)
              wan.write('DNS=' + req.body.wan.dns.primary + '\n');
            if (req.body.wan.dns.secondary && req.body.wan.dns.secondary.length)
              wan.write('DNS=' + req.body.wan.dns.secondary + '\n');
          }
        } else {
          wan.write(
            'Address=' + req.body.wan.ipaddr + '/' + req.body.wan.netmask + '\n'
          );
          wan.write('Gateway=' + req.body.wan.defgw + '\n');
          if (req.body.wan.dns.primary && req.body.wan.dns.primary.length)
            wan.write('DNS=' + req.body.wan.dns.primary + '\n');
          if (req.body.wan.dns.secondary && req.body.wan.dns.secondary.length)
            wan.write('DNS=' + req.body.wan.dns.secondary + '\n');
        }
        wan.end();
        if (isWlWan) {
          var dat =
            '[Match]\n' +
            'Name=br-wan\n\n' +
            '[Network]\n' +
            'Address=0.0.0.0/32\n';
          fs.writeFileSync('/etc/systemd/network/br-wan.network', dat);
        }

        if (wntsysconf.network.netmode != req.body.netmode) {
          var eth0 = fs.createWriteStream(
            '/etc/systemd/network/10-eth.network'
          );
          eth0.write('[Match]\n');
          eth0.write('Name=eth0\n\n');
          eth0.write('[Network]\n');
          if (req.body.netmode === 'nat') eth0.write('Bridge=br-lan\n');
          else eth0.write('Bridge=br-wan\n');
          eth0.end();

          var eth1 = fs.createWriteStream(
            '/etc/systemd/network/10-eth1.network'
          );
          eth1.write('[Match]\n');
          eth1.write('Name=eth1\n\n');
          eth1.write('[Network]\n');
          if (isWlWan && req.body.netmode === 'nat')
            eth1.write('Bridge=br-lan\n');
          else eth1.write('Bridge=br-wan\n');
          eth1.end();
        }

        wntsysconf.network.netmode = req.body.netmode;
        wntsysconf.network.wan = req.body.wan;
        if (!wntsysconf.network.configured) {
          // TODO: maybe what to do??
          wntsysconf.network.configured = true;
        }

        try {
          fs.writeFileSync(
            WNTSYSCONF_PATH,
            JSON.stringify(wntsysconf, undefined, 2)
          );
        } catch (e) {
          throw e;
        }

        var child = exec(
          '/bin/systemctl restart systemd-networkd.service',
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
          }
        );
      }

      res.send({ success: true });
    } catch (e) {
      throw new AppError('system data error', [e], 403);
    }
  });
});

router.post('/setLan', function (req, res) {
  fs.readFile(WNTSYSCONF_PATH, 'utf8', (err, data) => {
    if (err) throw new AppError('file not found', [err], 404);

    try {
      var changed = false;
      var wntsysconf = JSON.parse(data);

      console.log(req.body);

      if (
        wntsysconf.network.lan.ipaddr != req.body.lan.ipaddr ||
        wntsysconf.network.lan.netmask != req.body.lan.netmask ||
        wntsysconf.network.dhcpd.active != req.body.dhcpd.active ||
        wntsysconf.network.dhcpd.start != req.body.dhcpd.start ||
        wntsysconf.network.dhcpd.end != req.body.dhcpd.end ||
        wntsysconf.network.dhcpd.leasetime != req.body.dhcpd.leasetime
      ) {
        changed = true;
      }

      if (changed) {
        var brlan = fs.createWriteStream('/etc/systemd/network/br-lan.network');
        var dhcpd_action = 'none';
        brlan.write('[Match]\n');
        brlan.write('Name=br-lan\n\n');
        brlan.write('[Network]\n');
        brlan.write(
          'Address=' + req.body.lan.ipaddr + '/' + req.body.lan.netmask + '\n'
        );
        brlan.end();

        if (req.body.dhcpd.active) {
          var dhcpd_conf = fs.createWriteStream('/etc/udhcpd.conf');
          var dns = read_resolv_conf();
          dhcpd_conf.write('start      ' + req.body.dhcpd.start + '\n');
          dhcpd_conf.write('end        ' + req.body.dhcpd.end + '\n');
          dhcpd_conf.write('interface br-lan\n');
          dhcpd_conf.write('opt lease ' + req.body.dhcpd.leasetime + '\n');
          dhcpd_conf.write(
            'opt subnet ' + netmask2subnet(req.body.lan.netmask) + '\n'
          );
          dhcpd_conf.write('opt router ' + req.body.lan.ipaddr + '\n');
          if (dns.length > 0)
            dhcpd_conf.write('opt dns ' + dns.join(' ') + '\n');
          else
            dhcpd_conf.write(
              'opt dns ' +
                wntsysconf.network.wan.dns.primary +
                ' ' +
                wntsysconf.network.wan.dns.secondary +
                '\n'
            );
          dhcpd_conf.end();
        }

        if (wntsysconf.network.dhcpd.active != req.body.dhcpd.active) {
          if (wntsysconf.network.dhcpd.active) {
            dhcpd_action = 'stop';
          } else {
            dhcpd_action = 'start';
          }
        } else if (wntsysconf.network.dhcpd.active) {
          dhcpd_action = 'restart';
        }

        wntsysconf.network.lan = req.body.lan;
        wntsysconf.network.dhcpd = req.body.dhcpd;
        wntsysconf.network.configured = true;

        try {
          fs.writeFileSync(
            WNTSYSCONF_PATH,
            JSON.stringify(wntsysconf, undefined, 2)
          );
        } catch (e) {
          throw e;
        }

        var child = exec(
          '/bin/systemctl restart systemd-networkd.service',
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
            }
            if (dhcpd_action == 'stop') {
              execSync('/bin/systemctl stop udhcpd.service');
              execSync('/bin/systemctl disable udhcpd.service');
            } else if (dhcpd_action == 'start') {
              execSync('/bin/systemctl enable udhcpd.service');
              execSync('/bin/systemctl start udhcpd.service');
            } else if (dhcpd_action == 'restart') {
              execSync('/bin/systemctl restart udhcpd.service');
            }
          }
        );
      }

      res.send({ success: true });
    } catch (e) {
      throw new AppError('system data error', [e], 403);
    }
  });
});

router.post('/setWlan', function (req, res) {
  fs.readFile(WNTSYSCONF_PATH, 'utf8', (err, data) => {
    if (err) throw new AppError('file not found', [err], 404);

    try {
      var changed = false;
      var modeChanged = false;
      var wntsysconf = JSON.parse(data);
      var wasDisabled = false;

      console.log(req.body);

      if (
        req.body.wlan.mode === 'station' &&
        wntsysconf.network.netmode !== 'nat'
      ) {
        console.log(
          'netmode=' + wntsysconf.network.netmode + ', wifimode=station'
        );
        throw new AppError(
          'Bridge mode impossible when wifi mode is station.',
          [e],
          403
        );
      }

      if (typeof req.body.wlan.country === 'undefined')
        req.body.wlan.country = 'KR';
      if (typeof wntsysconf.network.wlan.country === 'undefined')
        wntsysconf.network.wlan.country = 'KR';

      if (
        wntsysconf.network.wlan.mode != req.body.wlan.mode ||
        wntsysconf.network.wlan.bridge != req.body.wlan.bridge ||
        wntsysconf.network.wlan.country != req.body.wlan.country ||
        wntsysconf.network.wlan.ssid != req.body.wlan.ssid ||
        wntsysconf.network.wlan.hibernate != req.body.wlan.hibernate ||
        wntsysconf.network.wlan.channel != req.body.wlan.channel ||
        wntsysconf.network.wlan.security != req.body.wlan.security ||
        wntsysconf.network.wlan.passphrase != req.body.wlan.passphrase
      ) {
        changed = true;
      }
      if (wntsysconf.network.wlan.mode === 'disabled') wasDisabled = true;

      if (changed) {
        if (req.body.wlan.mode === 'ap') {
          var args = new Array();
          args.push(req.body.wlan.ssid);
          args.push('br-lan');
          args.push(req.body.wlan.country);
          args.push(req.body.wlan.channel);
          args.push(req.body.wlan.hibernate ? '1' : '0');
          if (req.body.wlan.security) args.push(req.body.wlan.passphrase);
          execFileSync('/usr/bin/configure_hostapd.sh', args);

          if (wntsysconf.network.wlan.mode === 'station') {
            modeChanged = true;
          }
        } else if (req.body.wlan.mode === 'station') {
          if (wntsysconf.network.netmode !== 'nat') {
            console.log(
              'netmode=' + wntsysconf.network.netmode + ', wifimode=station'
            );
            throw new AppError(
              'Station mode impossible when netmode is not NAT.',
              [e],
              403
            );
          }

          var args = new Array();
          args.push(req.body.wlan.ssid);
          if (req.body.wlan.security) args.push(req.body.wlan.passphrase);
          execFileSync('/usr/bin/configure_wpasupp.sh', args);

          if (wntsysconf.network.wlan.mode === 'ap') {
            modeChanged = true;
          }
        } else {
          //disabled
          if (wntsysconf.network.wlan.mode === 'ap') {
            execSync('/bin/systemctl stop wnt-hostapd.service');
            execSync('/bin/systemctl disable wnt-hostapd.service');
            console.log('stop and disable hostapd');
          } else if (wntsysconf.network.wlan.mode === 'station') {
            execSync('/bin/systemctl stop wnt-wpasupp.service');
            execSync('/bin/systemctl disable wnt-wpasupp.service');
            console.log('stop and disable wpa-supplicant');
          }
        }

        wntsysconf.network.wlan = req.body.wlan;

        try {
          fs.writeFileSync(
            WNTSYSCONF_PATH,
            JSON.stringify(wntsysconf, undefined, 2)
          );
        } catch (e) {
          throw new AppError('system data error', [e], 403);
        }

        // reconfigure network interfaces
        var isWlWan = req.body.wlan.mode === 'station';
        var ifwan = isWlWan ? 'wlan0' : 'br-wan';

        // wan interface
        var dat = '[Match]\n' + 'Name=' + ifwan + '\n\n' + '[Network]\n';
        if (wntsysconf.network.wan.proto === 'dhcp') {
          dat += 'DHCP=ipv4\n';
          if (wntsysconf.network.wan.dns.mode !== 'auto') {
            if (
              wntsysconf.network.wan.dns.primary &&
              wntsysconf.network.wan.dns.primary.length
            )
              dat += 'DNS=' + wntsysconf.network.wan.dns.primary + '\n';
            if (
              wntsysconf.network.wan.dns.secondary &&
              wntsysconf.network.wan.dns.secondary.length
            )
              dat += 'DNS=' + wntsysconf.network.wan.dns.secondary + '\n';
          }
        } else {
          dat +=
            'Address=' +
            wntsysconf.network.wan.ipaddr +
            '/' +
            wntsysconf.network.wan.netmask +
            '\n';
          dat += 'Gateway=' + wntsysconf.network.wan.defgw + '\n';
          if (
            wntsysconf.network.wan.dns.primary &&
            wntsysconf.network.wan.dns.primary.length
          )
            dat += 'DNS=' + wntsysconf.network.wan.dns.primary + '\n';
          if (
            wntsysconf.network.wan.dns.secondary &&
            wntsysconf.network.wan.dns.secondary.length
          )
            dat += 'DNS=' + wntsysconf.network.wan.dns.secondary + '\n';
        }
        if (isWlWan) {
          fs.writeFileSync('/etc/systemd/network/30-wlan.network', dat);
          dat =
            '[Match]\n' +
            'Name=br-wan\n\n' +
            '[Network]\n' +
            'Address=0.0.0.0/32\n';
          fs.writeFileSync('/etc/systemd/network/br-wan.network', dat);
        } else {
          fs.writeFileSync('/etc/systemd/network/br-wan.network', dat);
          dat =
            '[Match]\n' +
            'Name=wlan0\n\n' +
            '[Network]\n' +
            'Address=0.0.0.0/32\n';
          fs.writeFileSync('/etc/systemd/network/30-wlan.network', dat);
        }

        // eth0
        dat = '[Match]\n' + 'Name=eth0\n\n' + '[Network]\n';
        if (wntsysconf.network.netmode === 'nat') dat += 'Bridge=br-lan\n';
        else dat += 'Bridge=br-wan\n';

        fs.writeFileSync('/etc/systemd/network/10-eth.network', dat);

        // eth1
        dat = '[Match]\n' + 'Name=eth1\n\n' + '[Network]\n';
        if (isWlWan) dat += 'Bridge=br-lan\n';
        else dat += 'Bridge=br-wan\n';

        fs.writeFileSync('/etc/systemd/network/10-eth1.network', dat);

        // reconfigure nat.service
        if (isWlWan)
          execSync(
            "/bin/sed -i -e 's/^ExecStart=.* br-wan .*/ExecStart=\\/usr\\/sbin\\/iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE/' /lib/systemd/system/nat.service"
          );
        else
          execSync(
            "/bin/sed -i -e 's/^ExecStart=.* wlan0 .*/ExecStart=\\/usr\\/sbin\\/iptables -t nat -A POSTROUTING -o br-wan -j MASQUERADE/' /lib/systemd/system/nat.service"
          );

        console.log('nat edit done');
        execSync('/bin/systemctl daemon-reload');
        execSync('/bin/systemctl restart systemd-networkd.service');
        execSync('/bin/systemctl restart nat.service');

        if (req.body.wlan.mode === 'ap') {
          if (modeChanged) {
            execSync('/bin/systemctl stop wnt-wpasupp.service');
            execSync('/bin/systemctl disable wnt-wpasupp.service');
            execSync('/bin/systemctl enable wnt-hostapd.service');
            execSync('/bin/systemctl start wnt-hostapd.service');
          } else {
            if (wasDisabled) {
              execSync('/bin/systemctl enable wnt-hostapd.service');
              execSync('/bin/systemctl start wnt-hostapd.service');
            } else {
              execSync('/bin/systemctl restart wnt-hostapd.service');
            }
          }
        } else if (req.body.wlan.mode === 'station') {
          if (modeChanged) {
            execSync('/bin/systemctl stop wnt-hostapd.service');
            execSync('/bin/systemctl disable wnt-hostapd.service');
            execSync('/bin/systemctl enable wnt-wpasupp.service');
            execSync('/bin/systemctl start wnt-wpasupp.service');
          } else {
            if (wasDisabled) {
              execSync('/bin/systemctl enable wnt-wpasupp.service');
              execSync('/bin/systemctl start wnt-wpasupp.service');
            } else {
              execSync('/bin/systemctl restart wnt-wpasupp.service');
            }
          }
        }
      }

      res.send({ success: true });
    } catch (e) {
      throw new AppError('system data error', [e], 403);
    }
  });
});

router.post('/setTimesync', function (req, res) {
  fs.readFile(WNTSYSCONF_PATH, 'utf8', (err, data) => {
    if (err) throw new AppError('file not found', [err], 404);

    try {
      var changed = false;
      var wntsysconf = JSON.parse(data);
      var timesyncd_action = 'restart';

      console.log(req.body);

      if (wntsysconf.system.timesyncd.timezone != req.body.timesyncd.timezone) {
        var child = execSync(
          '/usr/bin/timedatectl set-timezone ' + req.body.timesyncd.timezone,
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
          }
        );

        wntsysconf.system.timesyncd.timezone = req.body.timesyncd.timezone;
        changed = true;
      }

      if (req.body.timesyncd.enabled == false) {
        var dateString =
          req.body.timesyncd.manual_date.year +
          '-' +
          req.body.timesyncd.manual_date.month +
          '-' +
          req.body.timesyncd.manual_date.day +
          ' ' +
          req.body.timesyncd.manual_date.hour +
          ':' +
          req.body.timesyncd.manual_date.min +
          ':' +
          req.body.timesyncd.manual_date.sec;
        console.log('manual date set to "' + dateString + '"');
        if (wntsysconf.system.timesyncd.enabled) {
          var child = execSync('/bin/systemctl stop systemd-timesyncd.service');
          var child = execSync(
            '/bin/systemctl disable systemd-timesyncd.service'
          );

          timesyncd_action = 'none';
          wntsysconf.system.timesyncd.enabled = false;
          changed = true;
        }
        var child = execSync('/bin/date -s "' + dateString + '"');
        var child = execSync('/sbin/hwclock -w');
        dbService.updateAll('control_gateway', { time_sync_activation: 1 });
        dbService.insert('table_change_info', {
          table_name: 'control_gateway',
          column_name: 'time_sync_activation'
        });
      } else {
        if (
          wntsysconf.system.timesyncd.ntpservers.toString() !=
          req.body.timesyncd.ntpservers.toString()
        ) {
          var ws = fs.createWriteStream('/etc/systemd/timesyncd.conf');
          ws.write(
            '[Time]\nNTP=' + req.body.timesyncd.ntpservers.join(' ') + '\n'
          );
          ws.end();

          timesyncd_action = 'restart';
          wntsysconf.system.timesyncd.ntpservers =
            req.body.timesyncd.ntpservers;
          changed = true;
        }

        if (wntsysconf.system.timesyncd.enabled == false) {
          var child = execSync(
            '/bin/systemctl enable systemd-timesyncd.service'
          );

          timesyncd_action = 'start';
          wntsysconf.system.timesyncd.enabled = true;
          changed = true;
        }
      }

      if (changed) {
        try {
          fs.writeFileSync(
            WNTSYSCONF_PATH,
            JSON.stringify(wntsysconf, undefined, 2)
          );
        } catch (e) {
          throw new AppError('system data error', [e], 403);
        }

        if (timesyncd_action !== 'none')
          var child = exec(
            '/bin/systemctl ' + timesyncd_action + ' systemd-timesyncd.service',
            function (error, stdout, stderr) {
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
              if (error !== null) {
                console.log('exec error: ' + error);
              }
            }
          );
      }

      res.send({ success: true });
    } catch (e) {
      throw new AppError('system data error', [e], 403);
    }
  });
});

/*
 * Kernel Upgrade API
 */
var fwupProgress = {
  uploading: 'uploading',
  fileValidation: 'progressing',
  progressDTB: 0,
  progressKERN: 0,
  progressMOD: 0,
  bootPartUpdated: '',
  reboot: '',
  progressEnd: 'not',
  curKernVer: {
    krelease: '',
    kgitcmt: '',
    uts_ver: '',
    uts_rel: ''
  },
  newKernVer: {
    krelease: '',
    kgitcmt: '',
    uts_ver: '',
    uts_rel: ''
  }
};

function init_fwupProgress() {
  return {
    uploading: 'uploading',
    fileValidation: 'progressing',
    progressDTB: 0,
    progressKERN: 0,
    progressMOD: 0,
    bootPartUpdated: '',
    reboot: '',
    progressEnd: 'progressing',
    curKernVer: {
      krelease: '',
      kgitcmt: '',
      uts_ver: '',
      uts_rel: ''
    },
    newKernVer: {
      krelease: '',
      kgitcmt: '',
      uts_ver: '',
      uts_rel: ''
    }
  };
}

function mkdirp(directory) {
  try {
    fs.statSync(directory);
  } catch (e) {
    console.log('mkdir -p ' + directory);
    fs.mkdirSync(directory);
  }
}

function rmrf(directory) {
  console.log('rm -rf ' + directory);
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file, index) => {
      var cwd = directory + '/' + file;
      if (fs.lstatSync(cwd).isDirectory()) {
        rmrf(cwd);
      } else {
        fs.unlinkSync(cwd);
      }
    });
    fs.rmdirSync(directory);
  }
}

function getCurKernVer() {
  var uts_release = os.release();
  var uname_r = uts_release.split('-');
  var child = spawnSync('/bin/uname', ['-v']);
  var uname_v = child.stdout.toString();
  return {
    krelease: uname_r[0],
    kgitcmt: uname_r[3].substring(1),
    uts_ver: uname_v.trim(),
    uts_rel: uts_release
  };
}

let NAND_BLOCK_SIZE = 0x20000;

function get_standby_part() {
  var child = spawnSync('/sbin/fw_printenv');
  var active_part = child.stdout
    .toString()
    .split('\n')
    .filter((bootenv) => {
      return bootenv.indexOf('active_part=') == 0;
    });

  console.log('active_part=' + active_part.toString());

  if (active_part.length == 0) {
    return {
      part: '2',
      dtb_dev: '/dev/mtd9',
      kern_dev: '/dev/mtd10'
    };
  } else {
    return {
      part: '',
      dtb_dev: '/dev/mtd4',
      kern_dev: '/dev/mtd8'
    };
  }
}

function remove_old_kmodules(standby_part) {
  fs.readdirSync('/lib/modules/').forEach((file, index) => {
    if (
      file !== fwupProgress.curKernVer.uts_rel &&
      file !== fwupProgress.newKernVer.uts_rel
    ) {
      console.log('rm -rf /lib/modules/' + file);
      rmrf('/lib/modules/' + file);
    }
  });
}

function install_kmodules(standby_part) {
  var child = spawnSync('/bin/tar', ['tzvf', '/tmp/fwup/kernelmodules.tar.gz']);
  var files = child.stdout
    .toString()
    .split('\n')
    .filter((file) => {
      return file.trim().length > 0;
    });
  var file_cnt = files.length;

  console.log('[fwup]: file count in kernelmodules.tar.gz: ' + file_cnt);

  var extracted = 0;
  var remained = '';
  child = spawn('/bin/tar', [
    'xzvf',
    '/tmp/fwup/kernelmodules.tar.gz',
    '-C',
    '/lib/modules/'
  ]);
  child.stdout.on('data', (data) => {
    var isPartial = false;
    var dataStr = remained + data.toString();
    if (dataStr[dataStr.length - 1] != '\n') isPartial = true;

    var lines = dataStr.split(/\n/g).filter((line) => {
      return line.trim().length > 0;
    });
    if (isPartial) remained = lines.pop();
    extracted += lines.length;
    fwupProgress.progressMOD = Math.round((extracted * 100) / file_cnt, 0);
    console.log(
      '[fwup]: kernel module progress: ' +
        extracted +
        '/' +
        file_cnt +
        '(' +
        fwupProgress.progressMOD +
        '%)'
    );

    if (fwupProgress.progressMOD > 100) fwupProgress.progressMOD = 100;
  });
  child.on('close', (code) => {
    if (code) {
      fwupProgress.progressMOD = -1;
      fwupProgress.progressEnd = 'failure';
      console.error('[fwup]: failed to install kernel modules');
    } else {
      fwupProgress.progressMOD = 100;
      console.error('[fwup]: success to install kernel modules');

      exec(
        '/sbin/fw_setenv active_part ' + standby_part.part,
        (error, stdout, stderr) => {
          if (error) {
            fwupProgress.bootPartUpdated = 'failure';
            fwupProgress.progressEnd = 'failure';
            console.error('[fwup]: failed to change boot partition');
          } else {
            console.log('[fwup]: active_part set success');
            remove_old_kmodules(standby_part);

            fwupProgress.reboot = '';
            fwupProgress.bootPartUpdated = 'success';
            fwupProgress.progressEnd = 'success';
            /*
                    exec('/bin/systemctl reboot', (error, stdout, stderr) => {
                        if (error) {
                            fwupProgress.reboot = 'failed';
                            console.error('[fwup]: failed to reboot system');
                        }
                        else {
                            fwupProgress.reboot = 'progressing';
                            console.log('[fwup]: reboot issued');
                        }
                    });
                    */
          }
        }
      );
    }
  });
}

function flash_kernel(standby_part) {
  var img_size = get_file_size('/tmp/fwup/zImage.bin');
  console.log('[fwup]: kernel image size: ' + img_size);
  var remained = '';
  var child = spawn('/usr/sbin/nandwrite', [
    '-b',
    '1',
    '-n',
    '-p',
    standby_part.kern_dev,
    '/tmp/fwup/zImage.bin'
  ]);
  child.stdout.on('data', (data) => {
    var isPartial = false;
    var dataStr = remained + data.toString();
    if (dataStr[dataStr.length - 1] != '\n') isPartial = true;
    var lines = dataStr.split(/\n/g).filter((line) => {
      return line.trim().length > 0;
    });
    if (isPartial) {
      remained = lines.pop();
    }
    if (lines.length > 0) {
      var last_line = lines.pop();
      console.log('[fwup]: nandwrite kernel last line: ' + last_line);
      var last_offset = parseInt(last_line.split(' ').pop());
      console.log('[fwup]: nandwrite kernel last offset: ' + last_offset);
      if (last_offset + NAND_BLOCK_SIZE > img_size)
        fwupProgress.progressKERN = 100;
      else
        fwupProgress.progressKERN = Math.round(
          ((last_offset + NAND_BLOCK_SIZE) * 100) / img_size,
          0
        );

      console.log('[fwup]: kernel flasing: ' + fwupProgress.progressKERN + '%');
    }
  });

  child.on('close', (code) => {
    if (code) {
      fwupProgress.progressKERN = -1;
      fwupProgress.progressEnd = 'failure';
      console.error('failed to flash kernel image');
    } else {
      fwupProgress.progressKERN = 100;
      console.log('success to install kernel image');

      install_kmodules(standby_part);
    }
  });
}

function install_kernel(standby_part) {
  var child = spawn('/usr/sbin/flash_erase', [standby_part.kern_dev, '0', '0']);
  child.on('close', (code) => {
    if (code) {
      fwupProgress.progressKERN = -1;
      fwupProgress.progressEnd = 'failure';
      console.error('[fwup]: failed to flash_erase ' + standby_part.kern_dev);
    } else {
      console.error('[fwup]: success to flash_erase ' + standby_part.kern_dev);
      flash_kernel(standby_part);
    }
  });
}

function flash_dtb(standby_part) {
  var child = spawn('/usr/sbin/nandwrite', [
    '-b',
    '1',
    '-n',
    '-p',
    standby_part.dtb_dev,
    '/tmp/fwup/zImage.dtb'
  ]);
  child.on('close', (code) => {
    if (code) {
      fwupProgress.progressDTB = -1;
      fwupProgress.progressEnd = 'failure';
      console.error('[fwup]: failed to install kernel dtb');
    } else {
      fwupProgress.progressDTB = 100;
      console.log('[fwup]: success to install kernel dtb');

      // dtb then start to install kernel image
      install_kernel(standby_part);
    }
  });
}

function start_kernel_installation() {
  /* === start to install dtb */
  var standby_part = get_standby_part();

  // start to install dtb
  var child = spawn('/usr/sbin/flash_erase', [standby_part.dtb_dev, '0', '0']);
  child.on('close', (code) => {
    if (code) {
      fwupProgress.progressDTB = -1;
      fwupProgress.progressEnd = 'failure';
      console.error('[fwup]: failed to flash_erase ' + standby_part.dtb_dev);
    } else {
      console.log('[fwup]: success to flash_erase ' + standby_part.dtb_dev);
      flash_dtb(standby_part);
    }
  });
}

function do_fwup() {
  mkdirp('/tmp/fwup');
  var child = spawn('/bin/tar', [
    '-xf',
    FWUP_DIR + '/' + FWUP_TAR,
    '-C',
    '/tmp/fwup/'
  ]);
  child.on('close', (code) => {
    fs.unlinkSync(FWUP_DIR + '/' + FWUP_TAR); /* delete temporary file */

    if (code) {
      fwupProgress.fileValidation = 'failure';
      fwupProgress.progressEnd = 'failure';
      rmrf('/tmp/fwup');
    } else {
      fwupProgress.curKernVer = getCurKernVer();

      fs.readFile('/tmp/fwup/kernel_info.json', 'utf8', (err, data) => {
        if (err) {
          console.error('[fwup]: failed to read kernel_info.json');
          fwupProgress.fileValidation = 'failure';
          fwupProgress.progressEnd = 'failure';
          rmrf('/tmp/fwup');
          throw err;
        } else {
          try {
            fwupProgress.newKernVer = JSON.parse(data);
            fwupProgress.fileValidation = 'success';

            console.log('[fwup]: success to read kernel_info.json');
            start_kernel_installation();
          } catch (e) {
            console.error('[fwup]: failed to parse kernel_info.json');
            fwupProgress.fileValidation = 'failure';
            fwupProgress.progressEnd = 'failure';
            throw e;
          }
        }
      });
    }
  });
}

router.post('/fwup', upload_kernel.single('kernel_img'), function (req, res) {
  if (fwupProgress.progressEnd === 'progressing') {
    fs.unlink(FWUP_DIR + '/' + req.file.filename);
    res.send({ sucess: false, emsg: 'Upgrade in progress' });
  } else {
    fs.rename(
      FWUP_DIR + '/' + req.file.filename,
      FWUP_DIR + '/' + FWUP_TAR,
      (err) => {
        if (err) {
          console.error(
            '[fwup]: failed to rename ' +
              FWUP_DIR +
              '/' +
              req.file.filename +
              ' to ' +
              FWUP_DIR +
              '/' +
              FWUP_TAR
          );
          fwupProgress.progressEnd = 'failure';
          res.send({ sucess: false, emsg: 'System Error' });
        } else {
          fwupProgress = init_fwupProgress();
          fwupProgress.uploading = 'success';
          res.send({ success: true, progress: fwupProgress });

          do_fwup();
          logger.info('upgrade file : ' + JSON.stringify(req.file));
        }
      }
    );
  }
});

router.get('/fwupStatus', (req, res) => {
  res.send(fwupProgress);
  console.log(JSON.stringify(fwupProgress, undefined, 2));
});

/*
 * System Reboot API
 */
function rebootSystem() {
  exec('/bin/systemctl reboot', (error, stdout, stderr) => {
    if (error) {
      console.error('failed to reboot system');
      throw new AppError('System error', [error], 500);
    } else {
      console.log('reboot issued');
    }
  });
}

router.post('/reboot', (req, res) => {
  setTimeout(rebootSystem, 1000);
  res.send({ success: true });
});

var scan_ap = {
  status: 'none',
  results: []
};

function doScanAP() {
  scan_ap.status = 'init';
  scan_ap.results = [];
  var timeoutObj = new Object();
  const max_wait_time = 10000;
  var line_frag = '';
  var child = spawn('/usr/sbin/wpa_cli');
  child.stdout.on('data', (data) => {
    line_frag = data.toString();
    var lines = line_frag.split('\n').filter((entry) => {
      return entry.trim().length > 0;
    });
    //console.log(lines.toString());

    while (lines.length > 0) {
      var line_last = lines.pop().trim();
      //console.log('pop():' + line_last);
      if (line_last == '>') {
        if (scan_ap.status == 'init') {
          child.stdin.write('interface wlan0\n');
          scan_ap.status = 'selif';
        } else if (scan_ap.status == 'selif') {
          child.stdin.write('scan\n');
          scan_ap.status = 'scanning';
        }
      } else if (scan_ap.status == 'scanning') {
        if (line_last.indexOf('CTRL-EVENT-SCAN-RESULTS') >= 0) {
          child.stdin.write('scan_results\n');
          scan_ap.status = 'result';
        }
      } else if (scan_ap.status == 'result') {
        while (line_last.length > 0) {
          if (
            line_last.startsWith('bssid') ||
            line_last.indexOf('scan_result') >= 0
          ) {
            clearTimeout(timeoutObj);
            scan_ap.status = 'done';
            //console.log('SCAN RESULTS:');
            //console.log(JSON.stringify(scan_ap, undefined, 2));
            child.stdin.write('quit\n');
            child.stdin.end();
            break;
          }
          var i = 0;
          var ap = { bssid: '', freq: 0, rssi: 0, flag: '', ssid: '' };
          ap.bssid = line_last.slice(0, 17).trim();
          line_last = line_last.slice(17).trim();

          i = line_last.indexOf('\t');
          ap.freq = line_last.slice(0, i);
          line_last = line_last.slice(i).trim();

          i = line_last.indexOf('\t');
          ap.rssi = line_last.slice(0, i);
          line_last = line_last.slice(i).trim();

          i = line_last.indexOf('\t');
          ap.flag = line_last.slice(0, i);
          line_last = line_last.slice(i).trim();

          ap.ssid = line_last;

          scan_ap.results.push(ap);
          if (lines.length > 0) {
            line_last = lines.pop();
            //console.log('pop():' + line_last);
          } else break;
        }
      }
    }
    child.on('close', (code) => {
      if (code != 0) {
        scan_ap.status = 'failure';
      }
    });
  });

  timeoutObj = setTimeout(() => {
    scan_ap.status = 'timeout';
    child.stdin.end();
    //console.log(JSON.stringify(scan_ap, undefined, 2));
  }, max_wait_time);
}

router.post('/scanStart', (req, res) => {
  try {
    if (
      scan_ap.status === 'done' ||
      scan_ap.status === 'timeout' ||
      scan_ap.status === 'failure' ||
      scan_ap.status == 'none'
    ) {
      doScanAP();
    }
    res.send(scan_ap);
  } catch (e) {
    throw AppError('Failed to start scan', [scan_ap], 500);
  }
});

router.get('/scanStatus', (req, res) => {
  res.send(scan_ap);
});

module.exports = router;
