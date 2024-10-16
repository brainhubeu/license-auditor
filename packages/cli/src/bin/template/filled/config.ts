import type { Config } from "../../../types.js";
const config: Config = {
  blacklist: [
    "UNKNOWN",
    "389-exception",
    "AAL",
    "ADSL",
    "AFL-1.1",
    "AFL-1.2",
    "AFL-2.0",
    "AFL-2.1",
    "AFL-3.0",
    "AGPL-1.0-only",
    "AGPL-1.0-or-later",
    "AGPL-3.0-only",
    "AGPL-3.0-or-later",
    "AMDPLPA",
    "AML",
    "AMPAS",
    "ANTLR-PD",
    "APAFML",
    "APL-1.0",
    "APSL-1.0",
    "APSL-1.1",
    "APSL-1.2",
    "APSL-2.0",
    "Abstyles",
    "Adobe-2006",
    "Adobe-Glyph",
    "Afmparse",
    "Aladdin",
    "Apache-1.0",
    "Apache-1.1",
    "Artistic-1.0-Perl",
    "Artistic-1.0-cl8",
    "Artistic-1.0",
    "Artistic-2.0",
    "Autoconf-exception-2.0",
    "Autoconf-exception-3.0",
    "BSD-1-Clause",
    "BSD-2-Clause-FreeBSD",
    "BSD-2-Clause-NetBSD",
    "BSD-2-Clause-Patent",
    "BSD-3-Clause-Attribution",
    "BSD-3-Clause-Clear",
    "BSD-3-Clause-LBNL",
    "BSD-3-Clause-No-Nuclear-License-2014",
    "BSD-3-Clause-No-Nuclear-License",
    "BSD-3-Clause-No-Nuclear-Warranty",
    "BSD-3-Clause-Open-MPI",
    "BSD-4-Clause-UC",
    "BSD-4-Clause",
    "BSD-Protection",
    "BSD-Source-Code",
    "BSL-1.0",
    "Bahyph",
    "Barr",
    "Beerware",
    "Bison-exception-2.2",
    "BitTorrent-1.0",
    "BitTorrent-1.1",
    "BlueOak-1.0.0",
    "Bootloader-exception",
    "Borceux",
    "CATOSL-1.1",
    "CC-BY-1.0",
    "CC-BY-2.0",
    "CC-BY-2.5",
    "CC-BY-NC-1.0",
    "CC-BY-NC-2.0",
    "CC-BY-NC-2.5",
    "CC-BY-NC-3.0",
    "CC-BY-NC-4.0",
    "CC-BY-NC-ND-1.0",
    "CC-BY-NC-ND-2.0",
    "CC-BY-NC-ND-2.5",
    "CC-BY-NC-ND-3.0",
    "CC-BY-NC-ND-4.0",
    "CC-BY-NC-SA-1.0",
    "CC-BY-NC-SA-2.0",
    "CC-BY-NC-SA-2.5",
    "CC-BY-NC-SA-3.0",
    "CC-BY-NC-SA-4.0",
    "CC-BY-ND-1.0",
    "CC-BY-ND-2.0",
    "CC-BY-ND-2.5",
    "CC-BY-ND-3.0",
    "CC-BY-ND-4.0",
    "CC-BY-SA-1.0",
    "CC-BY-SA-2.0",
    "CC-BY-SA-2.5",
    "CC-BY-SA-3.0",
    "CC-BY-SA-4.0",
    "CC-PDDC",
    "CDDL-1.0",
    "CDDL-1.1",
    "CDLA-Permissive-1.0",
    "CDLA-Sharing-1.0",
    "CECILL-1.0",
    "CECILL-1.1",
    "CECILL-2.0",
    "CECILL-2.1",
    "CECILL-B",
    "CECILL-C",
    "CERN-OHL-1.1",
    "CERN-OHL-1.2",
    "CLISP-exception-2.0",
    "CNRI-Jython",
    "CNRI-Python-GPL-Compatible",
    "CNRI-Python",
    "CPAL-1.0",
    "CPL-1.0",
    "CPOL-1.02",
    "CUA-OPL-1.0",
    "Caldera",
    "ClArtistic",
    "Classpath-exception-2.0",
    "Condor-1.1",
    "Crossword",
    "CrystalStacker",
    "Cube",
    "D-FSL-1.0",
    "DOC",
    "DSDP",
    "DigiRule-FOSS-exception",
    "Dotseqn",
    "ECL-1.0",
    "ECL-2.0",
    "EFL-1.0",
    "EFL-2.0",
    "EPL-1.0",
    "EPL-2.0",
    "EUDatagrid",
    "EUPL-1.0",
    "EUPL-1.1",
    "EUPL-1.2",
    "Entessa",
    "ErlPL-1.1",
    "Eurosym",
    "FLTK-exception",
    "FSFAP",
    "FSFUL",
    "FSFULLR",
    "FTL",
    "Fair",
    "Fawkes-Runtime-exception",
    "Font-exception-2.0",
    "Frameworx-1.0",
    "FreeImage",
    "GCC-exception-2.0",
    "GCC-exception-3.1",
    "GFDL-1.1-only",
    "GFDL-1.1-or-later",
    "GFDL-1.2-only",
    "GFDL-1.2-or-later",
    "GFDL-1.3-only",
    "GFDL-1.3-or-later",
    "GL2PS",
    "GPL-1.0-only",
    "GPL-1.0-or-later",
    "GPL-2.0-only",
    "GPL-2.0-or-later",
    "GPL-3.0-linking-exception",
    "GPL-3.0-linking-source-exception",
    "GPL-3.0-only",
    "GPL-3.0-or-later",
    "GPL-CC-1.0",
    "Giftware",
    "Glide",
    "Glulxe",
    "HPND-sell-variant",
    "HPND",
    "HaskellReport",
    "IBM-pibs",
    "ICU",
    "IJG",
    "IPA",
    "IPL-1.0",
    "ImageMagick",
    "Imlib2",
    "Info-ZIP",
    "Intel-ACPI",
    "Intel",
    "Interbase-1.0",
    "JPNIC",
    "JSON",
    "JasPer-2.0",
    "LAL-1.2",
    "LAL-1.3",
    "LGPL-2.0-only",
    "LGPL-2.0-or-later",
    "LGPL-2.1-only",
    "LGPL-2.1-or-later",
    "LGPL-3.0-only",
    "LGPL-3.0-or-later",
    "LGPLLR",
    "LLVM-exception",
    "LPL-1.0",
    "LPL-1.02",
    "LPPL-1.0",
    "LPPL-1.1",
    "LPPL-1.2",
    "LPPL-1.3a",
    "LPPL-1.3c",
    "LZMA-exception",
    "Latex2e",
    "Leptonica",
    "LiLiQ-P-1.1",
    "LiLiQ-R-1.1",
    "LiLiQ-Rplus-1.1",
    "Libpng",
    "Libtool-exception",
    "Linux-OpenIB",
    "Linux-syscall-note",
    "MIT-0",
    "MIT-CMU",
    "MIT-advertising",
    "MIT-enna",
    "MIT-feh",
    "MITNFA",
    "MPL-1.0",
    "MPL-1.1",
    "MPL-2.0-no-copyleft-exception",
    "MPL-2.0",
    "MS-PL",
    "MS-RL",
    "MTLL",
    "MakeIndex",
    "MirOS",
    "Motosoto",
    "MulanPSL-1.0",
    "Multics",
    "Mup",
    "NASA-1.3",
    "NBPL-1.0",
    "NCSA",
    "NGPL",
    "NLOD-1.0",
    "NLPL",
    "NOSL",
    "NPL-1.0",
    "NPL-1.1",
    "NPOSL-3.0",
    "NRL",
    "NTP-0",
    "NTP",
    "Naumen",
    "Net-SNMP",
    "NetCDF",
    "Newsletr",
    "Nokia-Qt-exception-1.1",
    "Nokia",
    "Noweb",
    "OCCT-PL",
    "OCCT-exception-1.0",
    "OCLC-2.0",
    "OCaml-LGPL-linking-exception",
    "ODC-By-1.0",
    "ODbL-1.0",
    "OFL-1.0-RFN",
    "OFL-1.0-no-RFN",
    "OFL-1.0",
    "OFL-1.1-RFN",
    "OFL-1.1-no-RFN",
    "OFL-1.1",
    "OGL-Canada-2.0",
    "OGL-UK-1.0",
    "OGL-UK-2.0",
    "OGL-UK-3.0",
    "OGTSL",
    "OLDAP-1.1",
    "OLDAP-1.2",
    "OLDAP-1.3",
    "OLDAP-1.4",
    "OLDAP-2.0.1",
    "OLDAP-2.0",
    "OLDAP-2.1",
    "OLDAP-2.2.1",
    "OLDAP-2.2.2",
    "OLDAP-2.2",
    "OLDAP-2.3",
    "OLDAP-2.4",
    "OLDAP-2.5",
    "OLDAP-2.6",
    "OLDAP-2.7",
    "OLDAP-2.8",
    "OML",
    "OPL-1.0",
    "OSET-PL-2.1",
    "OSL-1.0",
    "OSL-1.1",
    "OSL-2.0",
    "OSL-2.1",
    "OSL-3.0",
    "OpenJDK-assembly-exception-1.0",
    "OpenSSL",
    "PDDL-1.0",
    "PHP-3.0",
    "PHP-3.01",
    "PS-or-PDF-font-exception-20170817",
    "PSF-2.0",
    "Parity-6.0.0",
    "Plexus",
    "PostgreSQL",
    "Python-2.0",
    "QPL-1.0",
    "Qhull",
    "Qt-GPL-exception-1.0",
    "Qt-LGPL-exception-1.1",
    "Qwt-exception-1.0",
    "RHeCos-1.1",
    "RPL-1.1",
    "RPL-1.5",
    "RPSL-1.0",
    "RSA-MD",
    "RSCPL",
    "Rdisc",
    "Ruby",
    "SAX-PD",
    "SCEA",
    "SGI-B-1.0",
    "SGI-B-1.1",
    "SGI-B-2.0",
    "SHL-0.5",
    "SHL-0.51",
    "SISSL-1.2",
    "SISSL",
    "SMLNJ",
    "SMPPL",
    "SNIA",
    "SPL-1.0",
    "SSH-OpenSSH",
    "SSH-short",
    "SSPL-1.0",
    "SWL",
    "Saxpath",
    "Sendmail-8.23",
    "Sendmail",
    "SimPL-2.0",
    "Sleepycat",
    "Spencer-86",
    "Spencer-94",
    "Spencer-99",
    "SugarCRM-1.1.3",
    "Swift-exception",
    "TAPR-OHL-1.0",
    "TCL",
    "TCP-wrappers",
    "TMate",
    "TORQUE-1.1",
    "TOSL",
    "TU-Berlin-1.0",
    "TU-Berlin-2.0",
    "UCL-1.0",
    "UPL-1.0",
    "Unicode-DFS-2015",
    "Unicode-DFS-2016",
    "Unicode-TOU",
    "Universal-FOSS-exception-1.0",
    "VOSTROM",
    "VSL-1.0",
    "Vim",
    "W3C-19980720",
    "W3C-20150513",
    "W3C",
    "Watcom-1.0",
    "Wsuipa",
    "WxWindows-exception-3.1",
    "X11",
    "XFree86-1.1",
    "XSkat",
    "Xerox",
    "Xnet",
    "YPL-1.0",
    "YPL-1.1",
    "ZPL-1.1",
    "ZPL-2.0",
    "ZPL-2.1",
    "Zed",
    "Zend-2.0",
    "Zimbra-1.3",
    "Zimbra-1.4",
    "blessing",
    "bzip2-1.0.5",
    "bzip2-1.0.6",
    "copyleft-next-0.3.0",
    "copyleft-next-0.3.1",
    "curl",
    "deprecated_AGPL-1.0",
    "deprecated_AGPL-3.0",
    "deprecated_GFDL-1.1",
    "deprecated_GFDL-1.2",
    "deprecated_GFDL-1.3",
    "deprecated_GPL-1.0+",
    "deprecated_GPL-1.0",
    "deprecated_GPL-2.0+",
    "deprecated_GPL-2.0-with-GCC-exception",
    "deprecated_GPL-2.0-with-autoconf-exception",
    "deprecated_GPL-2.0-with-bison-exception",
    "deprecated_GPL-2.0-with-classpath-exception",
    "deprecated_GPL-2.0-with-font-exception",
    "deprecated_GPL-2.0",
    "deprecated_GPL-3.0+",
    "deprecated_GPL-3.0-with-GCC-exception",
    "deprecated_GPL-3.0-with-autoconf-exception",
    "deprecated_GPL-3.0",
    "deprecated_LGPL-2.0+",
    "deprecated_LGPL-2.0",
    "deprecated_LGPL-2.1+",
    "deprecated_LGPL-2.1",
    "deprecated_LGPL-3.0+",
    "deprecated_LGPL-3.0",
    "deprecated_Nunit",
    "deprecated_StandardML-NJ",
    "deprecated_eCos-2.0",
    "deprecated_wxWindows",
    "diffmark",
    "dvipdfm",
    "eCos-exception-2.0",
    "eGenix",
    "etalab-2.0",
    "freertos-exception-2.0",
    "gSOAP-1.3b",
    "gnu-javamail-exception",
    "gnuplot",
    "i2p-gpl-java-exception",
    "iMatix",
    "libpng-2.0",
    "libselinux-1.0",
    "libtiff",
    "mif-exception",
    "mpich2",
    "openvpn-openssl-exception",
    "psfrag",
    "psutils",
    "u-boot-exception-2.0",
    "xinetd",
    "xpp",
    "zlib-acknowledgement",
    "UNLICENSED",
  ],
  whitelist: [
    "0BSD",
    "Apache-2.0",
    "Apache-2.0",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "CC-BY-3.0",
    "CC-BY-4.0",
    "CC0-1.0",
    "ISC",
    "MIT",
    "MPL-1.1",
    "Unlicense",
    "WTFPL",
    "Zlib",
  ],
  modules: {
    /* Examples: */
    /* Provide a module name as key and license type as value. */
    // 'module-name': 'license-type',
    /* You should use the value UNLICENSED for internal module. */
    // '@my-company/my-module': 'UNLICENSED',
    /* Providing a value protects you against unexpected changes of license
           in the package. */
    // 'some-module-i-bought': 'Commercial',
    /* The value may also be an array if the package has multiple */
    // 'another-module': ['MIT', 'Apache-2.0'],
    /* Providing any as value matches any license (this module will always
           be whitelisted). */
    // 'another-module': 'any',
  },
};

module.exports = { config };
