$(document).on("pagecreate", function () {
    $("#warnbutton").click(function () {
        if (window.confirm('This will erase all files in your all disks(A,B,C,D). Are you sure?')) {
            location.href = "/emu.aspx?cpm=&initdisk=";
        }
    });
});
//# sourceMappingURL=Default.js.map