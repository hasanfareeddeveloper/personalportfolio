<?php
// contact.php — PHP Contact Form Handler

// Configuration
$to_email    = "ali@example.com";   // ← apna email yahan daalo
$from_name   = "Portfolio Contact";
$site_name   = "Ali Khan Portfolio";

// Input sanitization
function clean($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Only handle POST requests
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name    = clean($_POST["name"]    ?? "");
    $email   = clean($_POST["email"]   ?? "");
    $subject = clean($_POST["subject"] ?? "No Subject");
    $message = clean($_POST["message"] ?? "");

    // Basic validation
    $errors = [];
    if (empty($name))    $errors[] = "Name is required.";
    if (empty($email) || !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL))
                         $errors[] = "Valid email is required.";
    if (empty($message)) $errors[] = "Message cannot be empty.";

    if (!empty($errors)) {
        // Redirect back with error
        $error_str = urlencode(implode(" | ", $errors));
        header("Location: index.html?status=error&msg=" . $error_str);
        exit;
    }

    // Compose email
    $email_subject = "[$site_name] $subject";
    $email_body    = "New message from your portfolio contact form:\n\n"
                   . "Name:    $name\n"
                   . "Email:   $email\n"
                   . "Subject: $subject\n\n"
                   . "Message:\n$message\n\n"
                   . "---\nSent from $site_name";

    $headers  = "From: $from_name <no-reply@example.com>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($to_email, $email_subject, $email_body, $headers)) {
        header("Location: index.html?status=success");
    } else {
        header("Location: index.html?status=error&msg=Mail+server+error.+Please+try+again.");
    }
    exit;

} else {
    // Not a POST request
    header("Location: index.html");
    exit;
}
?>
