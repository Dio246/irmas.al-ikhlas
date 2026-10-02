/**
 * GOOGLE APPS SCRIPT WEB APP FOR IRMAS MASJID JAMIE AL-IKHLAS
 * 
 * Fitur:
 * 1. GET: Mengambil daftar folder dan foto dokumentasi kegiatan dari Google Drive.
 * 2. POST (action: 'upload'): Mengunggah foto dokumentasi langsung ke folder kegiatan.
 * 3. POST / GET (action: 'delete' / 'delete_folder'): Menghapus foto atau menghapus seluruh folder kegiatan ke sampah (trash) di Google Drive.
 */

function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    
    // Support delete via GET request jika POST mengalami kendala CORS/redirect
    if (params && (params.action === 'delete' || params.action === 'delete_folder')) {
      return handleDelete(params);
    }
    
    var rootFolders = DriveApp.getFoldersByName("Dokumentasi IRMAS Al-Ikhlas");
    var rootFolder;
    if (rootFolders.hasNext()) {
      rootFolder = rootFolders.next();
    } else {
      rootFolder = DriveApp.createFolder("Dokumentasi IRMAS Al-Ikhlas");
    }

    var subFolders = rootFolder.getFolders();
    var items = [];

    while (subFolders.hasNext()) {
      var folder = subFolders.next();
      // Lewati folder yang ada di tempat sampah (trashed)
      if (folder.isTrashed()) continue;

      var folderName = folder.getName();
      var files = folder.getFiles();
      var images = [];
      var firstFileId = "";

      while (files.hasNext()) {
        var file = files.next();
        if (file.isTrashed()) continue;

        var mime = file.getMimeType();
        if (mime.indexOf("image/") !== -1) {
          if (!firstFileId) firstFileId = file.getId();
          images.push("https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1200");
        }
      }

      if (images.length > 0) {
        items.push({
          id: "gdrive-folder-" + folder.getId(),
          fileId: firstFileId,
          title: folderName,
          category: "kegiatan",
          date: Utilities.formatDate(folder.getDateCreated(), "Asia/Jakarta", "dd MMMM yyyy"),
          location: "Masjid Jami'e Al-Ikhlas",
          imageUrl: images[0],
          images: images,
          description: "Dokumentasi " + folderName + " di Google Drive (" + images.length + " foto)",
          participants: images.length,
          highlight: false,
          createdAt: folder.getDateCreated().getTime(),
          folderUrl: folder.getUrl(),
          folderName: folderName
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      count: items.length,
      items: items,
      folder: "Dokumentasi IRMAS Al-Ikhlas"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // 1. Aksi HAPUS foto atau folder kegiatan
    if (data.action === 'delete' || data.action === 'delete_folder') {
      return handleDelete(data);
    }

    // 2. Aksi UPLOAD foto
    if (!data.fileData) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Data foto tidak ditemukan."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var rootFolders = DriveApp.getFoldersByName("Dokumentasi IRMAS Al-Ikhlas");
    var rootFolder = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder("Dokumentasi IRMAS Al-Ikhlas");

    var targetFolderName = (data.activityTitle || data.folderName || "Kegiatan IRMAS").trim();
    var subFolders = rootFolder.getFoldersByName(targetFolderName);
    var targetFolder = subFolders.hasNext() ? subFolders.next() : rootFolder.createFolder(targetFolderName);

    var decoded = Utilities.base64Decode(data.fileData);
    var blob = Utilities.newBlob(decoded, data.mimeType || "image/jpeg", data.fileName || "dokumentasi.jpg");
    var newFile = targetFolder.createFile(blob);
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileId: newFile.getId(),
      fileName: newFile.getName(),
      directUrl: "https://lh3.googleusercontent.com/d/" + newFile.getId(),
      driveUrl: newFile.getUrl(),
      folderUrl: targetFolder.getUrl(),
      folderName: targetFolderName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleDelete(data) {
  var deletedCount = 0;
  
  // 1. Hapus file-file individual jika ada
  if (data.fileId && data.fileId !== 'undefined' && data.fileId.length > 5) {
    try {
      var file = DriveApp.getFileById(data.fileId);
      file.setTrashed(true);
      deletedCount++;
    } catch (e) {}
  }

  if (data.fileIds && Array.isArray(data.fileIds)) {
    data.fileIds.forEach(function(fid) {
      if (fid && fid !== 'undefined' && fid.length > 5) {
        try {
          var f = DriveApp.getFileById(fid);
          f.setTrashed(true);
          deletedCount++;
        } catch (e) {}
      }
    });
  }

  // 2. Hapus seluruh folder kegiatan jika folderId atau folderUrl diberikan
  var folderId = data.folderId;
  if (!folderId && data.folderUrl) {
    var match = data.folderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (match) folderId = match[1];
  }

  if (folderId && folderId.length > 5) {
    try {
      var folder = DriveApp.getFolderById(folderId);
      folder.setTrashed(true);
      deletedCount++;
    } catch (e) {}
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Data dan foto berhasil dihapus dari Google Drive (" + deletedCount + " item dipindahkan ke sampah).",
    deletedCount: deletedCount
  })).setMimeType(ContentService.MimeType.JSON);
}
