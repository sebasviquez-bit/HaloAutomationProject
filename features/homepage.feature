Feature: Halo Powered Website - Homepage validation

  Background:
    Given I am on the Halo homepage

  @smoke @nav
  Scenario: Verify primary navigation and hero content are visible
    Then I should see the main navigation items
    And I should see the hero headline

  @nav @header
  Scenario Outline: Header navigation links navigate correctly
    When I click the header menu "<menu>"
    Then the URL should include "<path>"

    Examples:
      | menu       | path       |
      | About      | about      |
      | Services   | services   |
      | Work       | work       |
      | Industries | industries |
      | Technology | technology |

  @smoke @cta
  Scenario: Click the "Explore Our Work" CTA and verify Work section loads
    When I click the Explore Our Work CTA
    Then I should be navigated to the Work section

  


